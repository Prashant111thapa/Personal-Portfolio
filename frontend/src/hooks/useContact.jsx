import { useState } from 'react';
import ContactServices from '../services/ContactServices';
import { toast } from 'react-toastify';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const useContact = () => {

    const { isAuthenticated } = useAuth();
    // Removed public form state - now handled in usePublicContact
    
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [allContacts, setAllContacts] = useState([]); // Store original contacts for filtering
    const [contactCount, setContactCount] = useState(0);
    const [currentContactId, setCurrentContactId] = useState(null);
    const [contactStatus, setContactStatus] = useState("unread");
    const [searchTerm, setSearchTerm] = useState("");

    const fetchContactMsg = async () => {
        setLoading(true);
        try {
            const result = await ContactServices.getAllContactMsg();
            if(result.success) {
                const contacts = result.data?.contactMessages || result.data || [];
                const contactsArray = Array.isArray(contacts) ? contacts : [];
                setAllContacts(contactsArray); // Store original for filtering
                setContacts(contactsArray);
                setContactCount(result.data?.count || contactsArray.length);
            } else {
                setAllContacts([]);
                setContacts([]);
                setContactCount(0);
            }
        } catch (err) {
            // Only show toast error if user is authenticated (meaning they expect to see contact messages)
            if (isAuthenticated) {
                toast.error("Error loading contact messages");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if(isAuthenticated) {
            fetchContactMsg();
        } else {
            // Clear contact data when logged out
            setContacts([]);
            setAllContacts([]);
            setContactCount(0);
            setCurrentContactId(null);
            setContactStatus("unread");
            setSearchTerm("");
        }
    }, [isAuthenticated]);

    // Removed handleInputChange and createContact - now in usePublicContact

    const handleClickMark = (contact) => {
        setCurrentContactId(contact.id);
    }

    const markContactMsgAsRead = async (e, contactId) => {
        e.preventDefault();
        setLoading(true);

        try {
            const result = await ContactServices.markContactAsRead(contactId);
            if(result.success) {
                toast.success("Contact marked as read");
                setContactStatus("read");
                await fetchContactMsg();
                // setCurrentContactId(null);
            } 
        } catch(err) {
            toast.error("Failed to mark contact read.");
        } finally {
            setLoading(false);
        }
    }

    const getContactByStatus = async (status) => {
        if (!status) {
            await fetchContactMsg(); // Show all contacts if no status selected
            return;
        }
        
        setLoading(true);
        setContactStatus(status);

        try {
            const result = await ContactServices.getContactByStatus(status);
            if(result.success) {
                const contacts = result.data?.contacts || result.data || [];
                setContacts(Array.isArray(contacts) ? contacts : []);
                setContactCount(result.data?.count || contacts.length);
            } else {
                setContacts([]);
                setContactCount(0);
                toast.error("No contacts found with selected status");
            }
        } catch (err) {
            toast.error("Failed to filter contacts by status");
            setContacts([]);
            setContactCount(0);
        } finally {
            setLoading(false);
        }
    }

    const deleteContact = async (e, contactId) => { // or can also use id or contact
        e.preventDefault();
        if(!window.confirm("Are you sure you want to delete this contact message? This action cannot be undone.")) return;

        setLoading(true);

        try {
            const result = await ContactServices.deleteContact(contactId);
            if(result.success) {
                toast.success("Contact message deleted successfully.");
                await fetchContactMsg();
            }
        } catch(err) {
            toast.error("Failed to delete contact.");
        } finally {
            setLoading(false);
        }
    }

    // Client-side search functionality
    const handleSearch = (term) => {
        setSearchTerm(term);
        
        if (!term.trim()) {
            setContacts(allContacts);
            setContactCount(allContacts.length);
            return;
        }
        
        const searchLower = term.toLowerCase();
        const filtered = allContacts.filter(contact => 
            contact.name.toLowerCase().includes(searchLower) ||
            contact.email.toLowerCase().includes(searchLower) ||
            contact.subject.toLowerCase().includes(searchLower) ||
            contact.message.toLowerCase().includes(searchLower)
        );
        
        setContacts(filtered);
        setContactCount(filtered.length);
    };

    // Clear search and show all contacts
    const clearSearch = () => {
        setSearchTerm("");
        setContacts(allContacts);
        setContactCount(allContacts.length);
    };

  return {
    // Admin-only functionality
    loading,
    fetchContactMsg,
    handleClickMark,
    markContactMsgAsRead,
    contacts,
    contactCount,
    contactStatus,
    getContactByStatus,
    deleteContact,
    
    // Search functionality
    searchTerm,
    handleSearch,
    clearSearch
  }
}

export default useContact;
