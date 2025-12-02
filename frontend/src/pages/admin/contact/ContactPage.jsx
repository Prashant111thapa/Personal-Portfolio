import React from 'react'
import useContact from '../../../hooks/useContact';
import Contact from './Contact';

const ContactPage = () => {

    const {
        loading,
        fetchContactMsg,
        markContactMsgAsRead,
        contacts,
        contactCount,
        contactStatus,
        getContactByStatus,
        deleteContact,
        searchTerm,
        handleSearch,
        clearSearch
    } = useContact();


  return (
    <div className='min-h-screen flex items-center justify-center bg-[#121212]'>
      <Contact 
        loading={loading}
        contacts={contacts}
        fetchContactMsg={fetchContactMsg}
        markContactMsgAsRead={markContactMsgAsRead}
        contactCount={contactCount}
        contactStatus={contactStatus}
        getContactByStatus={getContactByStatus}
        deleteContact={deleteContact}
        searchTerm={searchTerm}
        handleSearch={handleSearch}
        clearSearch={clearSearch}
    />
    </div>
  )
}

export default ContactPage;
