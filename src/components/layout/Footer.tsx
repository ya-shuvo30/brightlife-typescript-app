import React from 'react';

// Define the types for the component's props
interface FooterProps {
  navigateTo: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ navigateTo }) => {
    const socialLinks = [
        { name: 'Facebook', icon: 'M14 12v-1.5c0-.828.672-1.5 1.5-1.5h1.5V6h-2.25C11.56 6 9 8.56 9 11.25V13h-1.5v3H9v7h4v-7h2.25l.75-3H13v-1c0-.276.224-.5.5-.5h1.5z', href: 'https://www.facebook.com/profile.php?id=61577311361797' },
        { name: 'Twitter', icon: 'M22.46 6c-.64.28-1.32.47-2.03.56.74-.44 1.3-1.14 1.56-1.95-.69.41-1.45.71-2.26.86-.65-.69-1.58-1.12-2.6-1.12-1.97 0-3.56 1.6-3.56 3.56 0 .28.03.55.09.81-2.95-.15-5.57-1.56-7.32-3.7a3.56 3.56 0 001.1 4.74c-.59-.02-1.14-.18-1.62-.44v.04c0 2.2 1.56 4.03 3.64 4.45-.38.1-.78.15-1.19.15-.29 0-.57-.03-.85-.08.58 1.8 2.26 3.11 4.25 3.15-1.55 1.21-3.51 1.93-5.64 1.93-.37 0-.73-.02-1.09-.06 2 1.28 4.38 2.03 6.94 2.03 8.32 0 12.88-6.9 12.88-12.88 0-.2 0-.39-.01-.59.88-.64 1.65-1.44 2.26-2.34z', href: '#' },
        { name: 'Instagram', icon: 'M12 1.5a10.5 10.5 0 100 21 10.5 10.5 0 000-21zm0 2.25a8.25 8.25 0 110 16.5 8.25 8.25 0 010-16.5zm0 3a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5zm0 2.25a3 3 0 110 6 3 3 0 010-6zm5.25-3.375a.938.938 0 100 1.875.938.938 0 000-1.875z', href: '#' },
    ];
    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8">
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-xl font-bold font-heading mb-4"><span className="text-white">Bright</span><span className="text-green-300">Life</span></h3>
                        <p className="text-gray-400">Your future, brighter.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><a href="#" onClick={() => navigateTo('Home')} className="text-gray-400 hover:text-green-300 transition-colors">Home</a></li>
                            <li><a href="#" onClick={() => navigateTo('AboutUs')} className="text-gray-400 hover:text-green-300 transition-colors">About Us</a></li>
                            <li><a href="#" onClick={() => navigateTo('OurServices')} className="text-gray-400 hover:text-green-300 transition-colors">Services</a></li>
                            <li><a href="#" onClick={() => navigateTo('Contact')} className="text-gray-400 hover:text-green-300 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Partners</h4>
                        <ul className="space-y-2">
                            <li><a href="#" onClick={() => navigateTo('InsurancePartner')} className="text-gray-400 hover:text-green-300 transition-colors">Insurance Partner</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4 text-lg">Follow Us</h4>
                        <div className="flex space-x-4">
                            {socialLinks.map(link => (
                                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-300 transition-colors" title={link.name}>
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d={link.icon}></path></svg>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-700 pt-8 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Bright Life-Bangladesh Ltd. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
