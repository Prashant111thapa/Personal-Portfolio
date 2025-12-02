import { Check, Trash, Search, X } from 'lucide-react';
import React from 'react'
import Button from '../../../components/shared/Button';

const Contact = ({
  loading,
  contacts,
  fetchContactMsg,
  markContactMsgAsRead,
  contactCount,
  contactStatus,
  getContactByStatus,
  deleteContact,
  searchTerm,
  handleSearch,
  clearSearch
}) => {

  return (
    <div className='w-full max-w-7xl mx-auto border border-md border-[#FD6F00]/60 p-3 sm:p-6 text-white font-semibold rounded-lg' role="main">
      <header className='mb-4'>
        <h1 className='text-[#FD6F00]/70 font-bold text-xl sm:text-2xl' id="contact-inquiries-title">
          Contact Inquiries
        </h1>
        <p className='text-sm sm:text-base mb-2' aria-live="polite">
          Total Inquiries: <span className='font-bold'>{contactCount}</span>
          {searchTerm && (
            <span className='ml-2 text-[#FD6F00]'>
              (Filtered by: "{searchTerm}")
            </span>
          )}
        </p>
      </header>

      {loading ? (
        <div className='flex items-center justify-center p-8' role="status" aria-label="Loading contacts">
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#FD6F00]'></div>
          <p className='ml-2'>Loading contacts...</p>
        </div>
      ): (
        <div className='w-full p-2'>
          {contacts.length === 0 ? (
            <div className='flex flex-col items-center justify-center' role="status">
                <p className='mb-4'>{searchTerm ? 'No contacts match your search.' : 'No contact inquiries available.'}</p>
                <div className='flex flex-col sm:flex-row gap-2 items-center'>
                  <Button
                    onClick={fetchContactMsg}
                    disabled={loading}
                    aria-label="Reload contact messages"
                    className='w-full sm:w-auto'
                  >
                    Reload
                  </Button>
                  {searchTerm && (
                    <Button
                      onClick={clearSearch}
                      aria-label="Clear search filter"
                      className="bg-gray-600 hover:bg-gray-700 w-full sm:w-auto"
                    >
                      Clear Search
                    </Button>
                  )}
                </div>
            </div>
          ): (
            <div>
              {/* Search and Filter Controls */}
              <div className='flex flex-col lg:flex-row gap-4 mb-4 p-3 sm:p-4 bg-[#1a1a1a] rounded-lg'>
                {/* Search Input */}
                <div className='flex-1'>
                  <label htmlFor="search-contacts" className='block text-sm font-medium mb-2'>
                    Search Contacts
                  </label>
                  <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' size={18} />
                    <input
                      id="search-contacts"
                      type="text"
                      placeholder="Search by name, email, subject..."
                      value={searchTerm}
                      onChange={(e) => handleSearch(e.target.value)}
                      className='w-full pl-10 pr-10 py-2 bg-[#121212] border border-[#FD6F00]/50 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FD6F00]/70 focus:border-transparent text-sm'
                      aria-describedby="search-help"
                    />
                    {searchTerm && (
                      <button
                        onClick={clearSearch}
                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white'
                        aria-label="Clear search"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                  <p id="search-help" className='text-xs text-gray-400 mt-1'>
                    Search across all contact fields
                  </p>
                </div>
                
                {/* Status Filter */}
                <div className='lg:w-48 w-full'>
                  <label htmlFor="status-filter" className='block text-sm font-medium mb-2'>
                    Filter by Status
                  </label>
                  <select 
                    id="status-filter"
                    className='w-full p-2 border border-[#FD6F00]/50 bg-[#121212] hover:border-[#FD6F00]/70 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#FD6F00]/70 text-sm'
                    onChange={(e) => getContactByStatus(e.target.value)}
                    value={contactStatus}
                    aria-label="Filter contacts by status"
                  >
                    <option value="">All Contacts</option>
                    <option value="unread">Unread Only</option>
                    <option value="read">Read Only</option>
                  </select>
                </div>
              </div>

              {/* Contact Table */}
              <div className='overflow-x-auto'>
                <table className='w-full border-collapse mt-4 min-w-[800px]' role="table" aria-labelledby="contact-inquiries-title">
                  <thead>
                    <tr className='bg-gray-800'>
                      <th className='uppercase p-2 text-left text-xs sm:text-sm whitespace-nowrap' scope="col">SN</th>
                      <th className='uppercase p-2 text-left text-xs sm:text-sm whitespace-nowrap' scope="col">Name</th>
                      <th className='uppercase p-2 text-left text-xs sm:text-sm whitespace-nowrap' scope="col">Email</th>
                      <th className='uppercase p-2 text-left text-xs sm:text-sm whitespace-nowrap' scope="col">Subject</th>
                      <th className='uppercase p-2 text-left text-xs sm:text-sm whitespace-nowrap' scope="col">Message</th>
                      <th className='uppercase p-2 text-left text-xs sm:text-sm whitespace-nowrap' scope="col">Created</th>
                      <th className='uppercase p-2 text-left text-xs sm:text-sm whitespace-nowrap' scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                  {contacts.map((contact, index) => (
                    <tr key={contact.id} className='hover:bg-[#FD6F00]/50 border-b' role="row">
                      <td className='p-2 text-xs sm:text-sm'>{index + 1}</td>
                      <td className='p-2 text-xs sm:text-sm max-w-[120px] truncate'>{contact.name}</td>
                      <td className='p-2 text-xs sm:text-sm'>
                        <a href={`mailto:${contact.email}`} className='text-blue-400 hover:underline max-w-[150px] truncate block'>
                          {contact.email}
                        </a>
                      </td>
                      <td className='p-2 text-xs sm:text-sm max-w-[150px] truncate' title={contact.subject}>{contact.subject}</td>
                      <td className='p-2 text-xs sm:text-sm max-w-[200px] truncate' title={contact.message}>
                        {contact.message.length > 30
                          ? contact.message.slice(0, 30) + '...'
                          : contact.message
                        }
                      </td>
                      <td className='p-2 text-xs sm:text-sm whitespace-nowrap'>{new Date(contact.created_at).toLocaleDateString()}</td>
                      <td className='p-2'>
                        <div className='flex gap-1 sm:gap-2' role="group" aria-label="Contact actions">
                          <button 
                            onClick={(e) => markContactMsgAsRead(e, contact.id)}
                            className={`p-1 sm:p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-400 ${
                              contact.status === "read" 
                                ? 'bg-gray-600 cursor-not-allowed opacity-50' 
                                : 'bg-green-600 hover:bg-green-700'
                            }`}
                            aria-label={`Mark contact from ${contact.name} as read`}
                            disabled={contact.status === "read"}
                          >
                            <Check size={16} className='sm:w-[18px] sm:h-[18px]' />
                          </button>
                          <button
                            onClick={(e) => deleteContact(e, contact.id)}
                            className='bg-red-600 hover:bg-red-700 p-1 sm:p-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400'
                            aria-label={`Delete contact from ${contact.name}`}
                          >
                            <Trash size={16} className='sm:w-[18px] sm:h-[18px]' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  )
}

export default Contact;
