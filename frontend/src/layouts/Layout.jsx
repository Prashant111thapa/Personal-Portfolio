import React from 'react'
import Header from '../components/ui/Header';
import Footer from '../components/ui/Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
        {children}
      <Footer />
    </div>
  )
}

export default Layout;
