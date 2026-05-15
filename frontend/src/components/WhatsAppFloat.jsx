import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { WHATSAPP_DEFAULT } from '../utils/constants.js';

export default function WhatsAppFloat({ message = 'Hello Shresth Properties, I would like to know more.' }) {
  const num = WHATSAPP_DEFAULT;
  if (!num) return null;
  const href = `https://wa.me/${num}?text=${encodeURIComponent(message)}`;

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20"
      initial={{ scale: 0.85, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.95 }}
    >
      <MessageCircle className="h-7 w-7" strokeWidth={2} />
    </motion.a>
  );
}
