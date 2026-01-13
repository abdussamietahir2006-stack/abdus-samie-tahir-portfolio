
import React, { useState, useEffect, useRef } from 'react';
import { 
  motion, 
  AnimatePresence, 
  useSpring,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ExternalLink, 
  ChevronRight, 
  Code as CodeIcon, 
  Briefcase, 
  GraduationCap, 
  Cpu, 
  Globe, 
  Award, 
  Heart,
  Layers,
  Menu,
  X,
  Plus,
  Trash2,
  Edit3,
  Image as ImageIcon,
  Upload
} from 'lucide-react';

/**
 * --- TYPES ---
 */
interface Project {
  id: string;
  title: string;
  date: string;
  description: string;
  features: string[];
  tech: string[];
  liveLink: string;
  githubLink: string;
  image: string;
}

interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  details: string[];
}

interface Education {
  id: string;
  degree: string;
  institution: string;
  period: string;
  grade?: string;
  activities?: string[];
}

interface SkillGroup {
  id: string;
  title: string;
  skills: string[];
}

/**
 * --- UTILITIES ---
 */
const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

const usePersistedState = <T,>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (e) {}
  }, [key, state]);

  return [state, setState];
};

/**
 * --- 3D TILT EFFECT COMPONENT ---
 */
const TiltCard: React.FC<{ children: React.ReactNode; className?: string; disabled?: boolean }> = ({ children, className = "", disabled = false }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ 
        rotateX: disabled ? 0 : rotateX, 
        rotateY: disabled ? 0 : rotateY, 
        transformStyle: "preserve-3d" 
      }}
      className={`relative will-change-transform ${className}`}
    >
      <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }} className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
};

/**
 * --- MODAL COMPONENTS ---
 */
const Modal: React.FC<{ 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode 
}> = ({ isOpen, onClose, title, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-black/95 backdrop-blur-2xl"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 40 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 40 }}
          className="w-full max-w-2xl bg-[#0a0a0a] rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col"
        >
          <div className="p-8 md:p-10 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-3xl font-black text-white">{title}</h3>
            <button 
              onClick={onClose} 
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 text-gray-400 hover:text-white transition-all cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
          <div className="p-8 md:p-10 overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

const DeleteModal: React.FC<{ isOpen: boolean; onConfirm: () => void; onCancel: () => void }> = ({ isOpen, onConfirm, onCancel }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/98 backdrop-blur-3xl"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-sm bg-dark-800 rounded-[3rem] border border-white/10 p-10 text-center"
        >
          <Trash2 size={40} className="mx-auto text-red-500 mb-6" />
          <h3 className="text-2xl font-black text-white mb-4">Delete Permanently?</h3>
          <p className="text-gray-400 mb-10">This action cannot be undone.</p>
          <div className="space-y-4">
            <button onClick={onConfirm} className="w-full py-4 bg-red-600 text-white rounded-2xl font-black text-lg">Confirm</button>
            <button onClick={onCancel} className="w-full py-4 bg-white/5 text-white rounded-2xl font-black">Cancel</button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

/**
 * --- UI COMPONENTS ---
 */
const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', id: 'about' },
    { name: 'Experience', id: 'experience' },
    { name: 'Education', id: 'education' },
    { name: 'Projects', id: 'projects' },
    { name: 'Skills', id: 'skills' },
    { name: 'Contact', id: 'contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[500] transition-all duration-700 ${isScrolled ? 'py-4 bg-black/90 backdrop-blur-2xl border-b border-white/5' : 'py-10 bg-transparent'}`}>
      <div className="container mx-auto px-8 flex justify-center items-center">
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => { scrollToSection(link.id); setIsMenuOpen(false); }}
              className="text-xs font-black tracking-widest uppercase text-gray-500 hover:text-blue-500 transition-all cursor-pointer"
            >
              {link.name}
            </button>
          ))}
          <a 
            href="mailto:abdu.ssamietahir2006@gmail.com" 
            className="ml-4 px-8 py-3 rounded-xl bg-blue-600 text-white font-black text-xs tracking-widest uppercase hover:bg-blue-700 transition-all"
          >
            HIRE ME
          </a>
        </div>
        <button className="md:hidden ml-auto p-4 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="fixed inset-0 top-[80px] bg-black z-[499] p-10 flex flex-col gap-8 md:hidden">
            {navLinks.map((link) => (
              <button key={link.id} onClick={() => { scrollToSection(link.id); setIsMenuOpen(false); }} className="text-3xl font-black text-white hover:text-blue-500 uppercase">{link.name}</button>
            ))}
            <a href="mailto:abdu.ssamietahir2006@gmail.com" className="mt-10 py-6 bg-blue-600 rounded-2xl text-white font-black text-center text-xl uppercase">HIRE ME</a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const SectionTitle: React.FC<{ 
  title: string; 
  subtitle?: string; 
  align?: 'left' | 'center';
  onAdd?: () => void;
  actionLabel?: string;
}> = ({ title, subtitle, align = 'left', onAdd, actionLabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`mb-16 flex flex-col md:flex-row md:items-end ${align === 'center' ? 'md:justify-center' : 'justify-between'} gap-8 ${align === 'center' ? 'text-center' : ''}`}
  >
    <div className={align === 'center' ? 'flex flex-col items-center' : ''}>
      <div className={`flex items-center gap-4 mb-4 ${align === 'center' ? 'justify-center' : ''}`}>
        <span className="text-blue-500 font-mono text-xl font-bold">0{title.length % 9}.</span>
        <h2 className="text-4xl lg:text-5xl font-black text-white">{title}</h2>
      </div>
      {subtitle && <p className="text-gray-400 max-w-2xl text-lg mt-4 leading-relaxed font-medium">{subtitle}</p>}
      <div className={`h-1.5 w-24 bg-gradient-to-r from-blue-500 to-purple-600 mt-6 rounded-full ${align === 'center' ? 'mx-auto' : ''}`}></div>
    </div>
    {onAdd && (
      <div className={align === 'center' ? 'flex justify-center' : ''}>
        <button 
          onClick={(e) => { e.preventDefault(); onAdd(); }}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-black text-sm hover:bg-blue-700 transition-all cursor-pointer z-50 shadow-xl"
        >
          <Plus size={20} />
          {actionLabel || "Add New"}
        </button>
      </div>
    )}
  </motion.div>
);

const Hero: React.FC = () => {
  const [heroData, setHeroData] = usePersistedState('ast_hero', {
    name: "Abdus Samie Tahir",
    accent: "Tahir.",
    role: "Full Stack Developer | Software Engineer",
    description: "Building Scalable Web & Application Solutions | Open to Work (Software Developer & Full Stack Engineer roles)",
    image: "https://github.com/abdussamietahir2006-stack/Profile-pic/raw/b8e4744c9069f8ac9337635c03bf1b55f392708e/WhatsApp%20Image%202026-01-11%20at%2010.12.00%20PM.jpeg"
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroData({ ...heroData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const placeholderImage = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2070&auto=format&fit=crop";

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-32 pb-20 overflow-hidden bg-[#060606]">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }} 
            animate={{ opacity: 1, x: 0 }} 
            transition={{ duration: 1 }}
            className="flex-1 text-center lg:text-left"
          >
            <div className="flex justify-center lg:justify-start items-center gap-4 mb-10">
              <span className="inline-block px-6 py-2 rounded-xl bg-blue-500/10 text-blue-400 font-mono text-xs font-black border border-blue-500/10 tracking-widest uppercase">
                {heroData.role}
              </span>
              <button 
                onClick={() => setIsModalOpen(true)}
                type="button"
                className="p-2 rounded-lg bg-white/5 text-gray-500 hover:text-white transition-all cursor-pointer"
              >
                <Edit3 size={16} />
              </button>
            </div>
            <h1 className="text-6xl lg:text-8xl xl:text-[9rem] font-black text-white leading-[0.9] mb-12 tracking-tighter">
              {heroData.name.split(' ').slice(0, -1).join(' ')} <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                {heroData.accent}
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-400 mb-16 max-w-2xl font-medium leading-relaxed">
              {heroData.description}
            </p>
            <div className="flex flex-col sm:flex-row items-center lg:justify-start justify-center gap-8">
              <button onClick={() => scrollToSection('projects')} className="px-12 py-6 bg-blue-600 rounded-2xl text-white font-black text-lg hover:bg-blue-700 transition-all shadow-2xl">
                View Projects
              </button>
              <button onClick={() => scrollToSection('contact')} className="px-12 py-6 bg-white/5 border border-white/5 rounded-2xl text-white font-black text-lg hover:bg-white/10 transition-all">
                Contact Me
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ duration: 1 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <TiltCard className="w-full max-w-md">
              <div className="relative group p-4 rounded-[3.5rem] bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-white/10 shadow-2xl">
                <div className="aspect-square rounded-[2.5rem] overflow-hidden bg-dark-800 border-4 border-white/5 relative group/image">
                  <img 
                    src={heroData.image || placeholderImage} 
                    alt={heroData.name} 
                    className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                    onError={(e) => { (e.target as HTMLImageElement).src = placeholderImage; }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/image:opacity-100 transition-all duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => setIsModalOpen(true)}
                      type="button"
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl text-white font-black text-sm flex items-center gap-2 transition-all"
                    >
                      <ImageIcon size={18} />
                      Change Pic
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none rounded-[3.5rem]"></div>
                
                <div className="absolute -bottom-6 -right-6 px-10 py-5 rounded-2xl bg-white text-black font-black text-sm shadow-2xl z-20 flex items-center gap-3">
                  <Award className="text-blue-600" size={20} />
                  ENGINEERED IN NUST
                </div>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Hero Content">
        <div className="space-y-8">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-black text-gray-500 uppercase">Profile Picture</label>
            <div className="relative group/img overflow-hidden rounded-[2rem] bg-white/5 border border-dashed border-white/10 aspect-video flex flex-col items-center justify-center gap-4 max-w-md mx-auto w-full">
              {heroData.image ? (
                <img src={heroData.image} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <ImageIcon size={48} className="text-gray-700" />
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                 <button 
                  onClick={() => fileInputRef.current?.click()} 
                  type="button"
                  className="px-6 py-2 bg-blue-600 rounded-xl text-white font-black text-xs uppercase flex items-center gap-2"
                 >
                   <Upload size={14} /> Upload Pic
                 </button>
                 <span className="text-[10px] text-gray-400 uppercase font-black">Or Paste URL Below</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileChange} 
            />
            <input 
              placeholder="Paste Image URL here..." 
              value={heroData.image} 
              onChange={e => setHeroData({...heroData, image: e.target.value})} 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 text-sm" 
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-[10px] font-black uppercase mb-2 ml-1">Full Name</label>
              <input 
                value={heroData.name} 
                onChange={e => setHeroData({...heroData, name: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500" 
              />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] font-black uppercase mb-2 ml-1">Accent (Tahir.)</label>
              <input 
                value={heroData.accent} 
                onChange={e => setHeroData({...heroData, accent: e.target.value})}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500" 
              />
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-black uppercase mb-2 ml-1">Professional Role</label>
            <input 
              value={heroData.role} 
              onChange={e => setHeroData({...heroData, role: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-black uppercase mb-2 ml-1">Short Bio</label>
            <textarea 
              value={heroData.description} 
              onChange={e => setHeroData({...heroData, description: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 h-32 resize-none" 
            />
          </div>
          <button onClick={() => setIsModalOpen(false)} type="button" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg">Apply Changes</button>
        </div>
      </Modal>
    </section>
  );
};

const About: React.FC = () => {
  const [aboutData, setAboutData] = usePersistedState('ast_about', {
    p1: "I am currently pursuing a Bachelor’s degree in Computer Software Engineering at NUST (expected graduation July 2028), where I translate complex problems into elegant code.",
    p2: "I am passionate about Full Stack and software development, with hands-on experience building web applications using Java, JavaScript, React.js, HTML, CSS, and databases. I enjoy solving complex problems, learning new frameworks, and applying best practices to deliver high-quality applications.",
    p3: "Alongside my studies, I am gaining professional experience as a Human Resources Intern at GAOTek Inc., contributing to recruitment, onboarding, employee engagement, and HR administration. I aim to combine my technical expertise with HR operations to create innovative, efficient, and inclusive solutions."
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="about" className="py-32 px-6 bg-dark-900/80 relative overflow-hidden scroll-mt-24">
      <div className="container mx-auto">
        <SectionTitle 
          title="About Me" 
          subtitle="The bridge between human needs and technical solutions." 
          onAdd={() => setIsModalOpen(true)}
          actionLabel="Edit Bio"
        />
        
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          <div className="lg:col-span-3 space-y-10">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative p-10 lg:p-14 rounded-[2.5rem] bg-dark-800 border border-white/5 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <Globe size={200} />
              </div>
              <p className="text-xl lg:text-2xl text-gray-200 leading-relaxed font-light mb-8 italic border-l-4 border-blue-500 pl-8">
                "{aboutData.p1}"
              </p>
              <p className="text-lg text-gray-400 leading-relaxed mb-8">
                {aboutData.p2}
              </p>
              <p className="text-lg text-gray-400 leading-relaxed">
                {aboutData.p3}
              </p>
            </motion.div>
          </div>

          <div className="lg:col-span-2 grid gap-6">
            <div className="grid gap-6">
              {[
                { label: 'University', value: 'NUST Islamabad', icon: <GraduationCap size={20}/> },
                { label: 'Focus', value: 'Full Stack Dev', icon: <CodeIcon size={20}/> },
                { label: 'Role', value: 'HR Intern @ GAOTek', icon: <Briefcase size={20}/> },
                { label: 'Location', value: 'Remote / Pakistan', icon: <Globe size={20}/> }
              ].map((item, i) => (
                <TiltCard key={i}>
                  <div className="p-8 rounded-3xl border border-white/5 bg-dark-800 flex items-center gap-6 hover:border-blue-500/40 transition-all">
                    <div className="p-4 rounded-2xl bg-dark-700 text-blue-500">
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-1">{item.label}</div>
                      <div className="text-white font-bold text-lg">{item.value}</div>
                    </div>
                  </div>
                </TiltCard>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Edit Bio Content">
        <div className="space-y-6">
          <div>
            <label className="block text-gray-500 text-xs font-black uppercase mb-2">Quote Paragraph</label>
            <textarea 
              value={aboutData.p1} 
              onChange={e => setAboutData({...aboutData, p1: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 h-32" 
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-black uppercase mb-2">Body Paragraph 1</label>
            <textarea 
              value={aboutData.p2} 
              onChange={e => setAboutData({...aboutData, p2: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 h-32" 
            />
          </div>
          <div>
            <label className="block text-gray-500 text-xs font-black uppercase mb-2">Body Paragraph 2</label>
            <textarea 
              value={aboutData.p3} 
              onChange={e => setAboutData({...aboutData, p3: e.target.value})}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-blue-500 h-32" 
            />
          </div>
          <button onClick={() => setIsModalOpen(false)} type="button" className="w-full py-4 bg-blue-600 text-white rounded-xl font-black">Save Bio</button>
        </div>
      </Modal>
    </section>
  );
};

const ExperienceCard: React.FC<{ exp: Experience; onEdit: () => void; onDelete: () => void }> = ({ exp, onEdit, onDelete }) => (
  <motion.div
    initial={{ opacity: 0, x: -40 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-12 pb-16 last:pb-0 border-l-2 border-dashed border-gray-800 group"
  >
    <div className="absolute left-[-11px] top-0 w-[20px] h-[20px] rounded-full bg-dark-900 border-4 border-blue-500 group-hover:border-purple-500 group-hover:scale-125 transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
    <TiltCard>
      <div className="p-8 lg:p-10 rounded-[2rem] bg-dark-800 border border-white/5 hover:border-blue-500/30 transition-all shadow-xl relative overflow-hidden group/card">
        <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover/card:opacity-100 transition-all z-[100] pointer-events-auto">
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} type="button" className="p-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer hover:scale-110 transition-transform"><Edit3 size={18} /></button>
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} type="button" className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer hover:scale-110 transition-transform"><Trash2 size={18} /></button>
        </div>
        <div className="flex flex-wrap items-start justify-between mb-8 gap-6 relative z-10">
          <div>
            <h3 className="text-2xl lg:text-3xl font-black text-white mb-2">{exp.role}</h3>
            <div className="text-blue-400 font-bold text-lg flex items-center gap-2">
              <span className="w-4 h-0.5 bg-blue-500"></span>
              {exp.company}
            </div>
          </div>
          <div className="text-right">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-dark-700 text-gray-300 font-mono text-xs border border-white/5">
              <Briefcase size={12} /> {exp.period}
            </div>
            <div className="text-gray-500 text-sm mt-3 flex items-center justify-end gap-1">🌍 {exp.location}</div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4 relative z-10">
          {exp.details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-dark-900/50 border border-white/5 hover:bg-dark-900 transition-colors">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-2 flex-shrink-0 shadow-[0_0_5px_rgba(168,85,247,0.8)]"></div>
              <span className="text-gray-400 leading-relaxed text-sm">{detail}</span>
            </div>
          ))}
        </div>
      </div>
    </TiltCard>
  </motion.div>
);

const ExperienceSection: React.FC = () => {
  const [experiences, setExperiences] = usePersistedState<Experience[]>('ast_exp_data', [
    {
      id: '1',
      role: "Human Resources Intern",
      company: "GAOTek Inc.",
      period: "Sep 2025 – Present",
      location: "Remote",
      details: [
        "Recruitment & Selection Support",
        "Onboarding & Orientation",
        "Employee Record Management & Engagement",
        "HR Administration & Reporting"
      ]
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState<Experience>({ id: '', role: '', company: '', period: '', location: '', details: [] });

  const handleSave = () => {
    if (editingIdx !== null) {
      const updated = [...experiences];
      updated[editingIdx] = formData;
      setExperiences(updated);
    } else {
      setExperiences([...experiences, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <section id="experience" className="py-32 px-6">
      <div className="container mx-auto">
        <SectionTitle 
          title="Experience" 
          subtitle="Professional roles that have shaped my perspective." 
          onAdd={() => { setEditingIdx(null); setFormData({ id: '', role: '', company: '', period: '', location: '', details: [] }); setIsModalOpen(true); }}
        />
        <div className="max-w-5xl mx-auto">
          {experiences.map((exp, idx) => (
            <ExperienceCard 
              key={exp.id} 
              exp={exp} 
              onEdit={() => { setEditingIdx(idx); setFormData(exp); setIsModalOpen(true); }}
              onDelete={() => setExperiences(experiences.filter((_, i) => i !== idx))}
            />
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIdx !== null ? "Edit Experience" : "Add Experience"}>
        <div className="space-y-4">
          <input placeholder="Role" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} />
          <input placeholder="Company" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} />
          <input placeholder="Period" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
          <input placeholder="Location" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
          <textarea placeholder="Details (comma separated)" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none h-32" value={formData.details.join(', ')} onChange={e => setFormData({...formData, details: e.target.value.split(',').map(s => s.trim())})} />
          <button onClick={handleSave} type="button" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">Save Experience</button>
        </div>
      </Modal>
    </section>
  );
};

/**
 * --- EDUCATION CARD COMPONENT ---
 */
const EducationCard: React.FC<{ edu: Education; onEdit: () => void; onDelete: () => void }> = ({ edu, onEdit, onDelete }) => (
  <TiltCard>
    <div className="h-full p-10 rounded-[2.5rem] bg-dark-800 border border-white/5 hover:border-blue-500/40 transition-all flex flex-col shadow-2xl relative group min-h-[420px]">
      <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-[150] pointer-events-auto">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onEdit(); }} 
          type="button"
          title="Edit Education"
          className="p-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer shadow-lg backdrop-blur-md hover:scale-110 transition-transform active:scale-95 border border-blue-500/10"
        >
          <Edit3 size={18} />
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onDelete(); }} 
          type="button"
          title="Delete Education"
          className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer shadow-lg backdrop-blur-md hover:scale-110 transition-transform active:scale-95 border border-red-500/10"
        >
          <Trash2 size={18} />
        </button>
      </div>
      <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-8 shadow-inner">
        <GraduationCap size={36} />
      </div>
      <h3 className="text-2xl font-black text-white mb-4 leading-tight pr-12">{edu.degree}</h3>
      <p className="text-gray-300 text-lg mb-2 font-medium">{edu.institution}</p>
      <div className="text-gray-500 text-sm mb-6 font-mono font-bold">{edu.period}</div>
      
      {edu.grade && (
        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
          <span className="text-purple-400 font-mono text-sm uppercase tracking-widest">Achievement</span>
          <span className="px-4 py-1 rounded-full bg-purple-500/10 text-purple-400 font-bold border border-purple-500/20">{edu.grade}</span>
        </div>
      )}
      
      {edu.activities && edu.activities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {edu.activities.map((act, i) => (
            <span key={i} className="px-3 py-1 rounded-lg bg-dark-700 text-gray-400 text-xs border border-white/5">{act}</span>
          ))}
        </div>
      )}
    </div>
  </TiltCard>
);

const EducationSection: React.FC = () => {
  const [education, setEducation] = usePersistedState<Education[]>('ast_edu_data_final', [
    {
      id: '1',
      degree: "Bachelor’s in Computer Software Engineering",
      institution: "National University of Sciences and Technology (NUST)",
      period: "Oct 2024 – Jul 2028",
      grade: "Grade: A",
      activities: ["Devcon 2025 team", "Sports participation"]
    },
    {
      id: '2',
      degree: "Intermediate Pre-Engineering",
      institution: "Punjab Group Of Colleges",
      period: "2022",
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState<Education>({ id: '', degree: '', institution: '', period: '', grade: '', activities: [] });

  const handleOpenAdd = () => {
    setEditingIdx(null);
    setFormData({ id: Date.now().toString(), degree: '', institution: '', period: '', grade: '', activities: [] });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (idx: number) => {
    setEditingIdx(idx);
    // Deep clone or spread to avoid reference issues
    const item = education[idx];
    setFormData({ ...item, activities: item.activities ? [...item.activities] : [] });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingIdx !== null) {
      const updated = [...education];
      updated[editingIdx] = formData;
      setEducation(updated);
    } else {
      setEducation([...education, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteIdx !== null) {
      setEducation(education.filter((_, i) => i !== deleteIdx));
      setIsDeleteModalOpen(false);
      setDeleteIdx(null);
    }
  };

  return (
    <section id="education" className="py-32 px-6 bg-dark-900/80">
      <div className="container mx-auto">
        <SectionTitle 
          title="Education" 
          align="center" 
          onAdd={handleOpenAdd}
        />
        <div className="grid md:grid-cols-2 gap-10">
          {education.map((edu, idx) => (
            <EducationCard 
              key={edu.id} 
              edu={edu} 
              onEdit={() => handleOpenEdit(idx)}
              onDelete={() => { setDeleteIdx(idx); setIsDeleteModalOpen(true); }}
            />
          ))}
        </div>
      </div>
      
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIdx !== null ? "Edit Education" : "Add Education"}>
        <div className="space-y-5">
          <div>
            <label className="block text-gray-500 text-[10px] font-black uppercase mb-1.5 ml-1">Degree / Certification</label>
            <input placeholder="e.g. Bachelor’s in Software Engineering" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-black uppercase mb-1.5 ml-1">Institution</label>
            <input placeholder="e.g. NUST" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" value={formData.institution} onChange={e => setFormData({...formData, institution: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-[10px] font-black uppercase mb-1.5 ml-1">Period</label>
              <input placeholder="e.g. 2024 - 2028" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" value={formData.period} onChange={e => setFormData({...formData, period: e.target.value})} />
            </div>
            <div>
              <label className="block text-gray-500 text-[10px] font-black uppercase mb-1.5 ml-1">Grade / CGPA</label>
              <input placeholder="e.g. A" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-colors" value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-gray-500 text-[10px] font-black uppercase mb-1.5 ml-1">Activities (comma separated)</label>
            <textarea placeholder="e.g. Sports participation, Tech Clubs" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 h-24 resize-none transition-colors" value={formData.activities?.join(', ') || ''} onChange={e => setFormData({...formData, activities: e.target.value.split(',').map(s => s.trim()).filter(Boolean)})} />
          </div>
          <button onClick={(e) => { e.preventDefault(); handleSave(); }} type="button" className="w-full py-5 bg-blue-600 text-white rounded-2xl font-black text-lg shadow-2xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95">Save Education</button>
        </div>
      </Modal>

      <DeleteModal isOpen={isDeleteModalOpen} onConfirm={handleConfirmDelete} onCancel={() => setIsDeleteModalOpen(false)} />
    </section>
  );
};

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = usePersistedState<Project[]>('ast_proj_data', [
    {
      id: '1',
      title: "Basti The Food Street",
      date: "Nov 2025 – Jan 2026",
      description: "A flagship NUST project: A high-fidelity, responsive restaurant application with an interactive interface and full reservation system.",
      features: ["Dynamic Menu Explorer", "Cloud Reservation System", "Interactive UX Elements"],
      tech: ["React.js", "JavaScript", "Tailwind CSS", "Node.js"],
      liveLink: "https://basti-the-food-street.vercel.app/",
      githubLink: "https://github.com/abdussamietahir2006-stack/basti-the-food-street",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState<Project>({ id: '', title: '', date: '', description: '', features: [], tech: [], liveLink: '', githubLink: '', image: '' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (editingIdx !== null) {
      const updated = [...projects];
      updated[editingIdx] = formData;
      setProjects(updated);
    } else {
      setProjects([...projects, { ...formData, id: Date.now().toString() }]);
    }
    setIsModalOpen(false);
  };

  return (
    <section id="projects" className="py-32 px-6">
      <div className="container mx-auto">
        <SectionTitle 
          title="Projects" 
          subtitle="Engineering digital experiences with purpose." 
          onAdd={() => { setEditingIdx(null); setFormData({ id: '', title: '', date: '', description: '', features: [], tech: [], liveLink: '', githubLink: '', image: '' }); setIsModalOpen(true); }}
        />
        <div className="grid lg:grid-cols-1 gap-16">
          {projects.map((proj, idx) => (
            <motion.div
              key={proj.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group relative rounded-[3rem] overflow-hidden bg-dark-800 border border-white/5 flex flex-col lg:flex-row shadow-[0_50px_100px_rgba(0,0,0,0.4)]"
            >
              <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all z-20">
                <button onClick={() => { setEditingIdx(idx); setFormData(proj); setIsModalOpen(true); }} type="button" className="p-3 rounded-xl bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer backdrop-blur-md"><Edit3 size={18} /></button>
                <button onClick={() => setProjects(projects.filter((_, i) => i !== idx))} type="button" className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer backdrop-blur-md"><Trash2 size={18} /></button>
              </div>
              <div className="lg:w-[55%] h-80 lg:h-[600px] relative overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-dark-900 via-transparent to-transparent opacity-80"></div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-dark-900/40 backdrop-blur-sm">
                  <div className="flex gap-6">
                    <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="p-4 bg-blue-600 rounded-2xl hover:bg-blue-700 transition-transform hover:scale-110">
                      <ExternalLink size={30} className="text-white" />
                    </a>
                    <a href={proj.githubLink} target="_blank" rel="noopener noreferrer" className="p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-transform hover:scale-110 border border-white/10">
                      <Github size={30} className="text-white" />
                    </a>
                  </div>
                </div>
              </div>
              <div className="lg:w-[45%] p-10 lg:p-16 flex flex-col justify-center">
                <div className="text-xs text-blue-400 font-mono mb-4 uppercase tracking-[0.3em] font-black">{proj.date}</div>
                <h3 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-white leading-tight">{proj.title}</h3>
                <p className="text-gray-400 text-lg mb-8 leading-relaxed font-light">{proj.description}</p>
                <div className="flex flex-wrap gap-3 mb-10">
                  {proj.tech.map((t, i) => (
                    <span key={i} className="text-xs px-4 py-2 rounded-full bg-dark-700 text-gray-300 font-mono border border-white/5">{t}</span>
                  ))}
                </div>
                <div className="flex items-center gap-6">
                  <a href={proj.liveLink} target="_blank" rel="noopener noreferrer" className="text-white font-bold flex items-center gap-2 group/link">
                    Live Demo <ChevronRight size={18} className="text-blue-500 group-hover/link:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIdx !== null ? "Edit Project" : "Add Project"}>
        <div className="space-y-4">
          <div className="flex flex-col gap-4">
            <label className="text-xs font-black text-gray-500 uppercase">Project Image</label>
            <div className="relative group/img overflow-hidden rounded-2xl bg-white/5 border border-dashed border-white/10 aspect-video flex flex-col items-center justify-center gap-4">
              {formData.image ? <img src={formData.image} alt="Preview" className="w-full h-full object-cover" /> : <ImageIcon size={48} className="text-gray-700" />}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/img:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
                 <button onClick={() => fileInputRef.current?.click()} type="button" className="px-6 py-2 bg-blue-600 rounded-xl text-white font-black text-xs uppercase flex items-center gap-2"><Upload size={14} /> Upload Pic</button>
                 <span className="text-[10px] text-gray-400 uppercase font-black">Or Paste URL Below</span>
              </div>
            </div>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
            <input placeholder="Image URL" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} />
          </div>
          <input placeholder="Title" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <input placeholder="Date" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
          <textarea placeholder="Description" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none h-24" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
          <input placeholder="Tech (comma separated)" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.tech.join(', ')} onChange={e => setFormData({...formData, tech: e.target.value.split(',').map(s => s.trim())})} />
          <input placeholder="Live Link" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.liveLink} onChange={e => setFormData({...formData, liveLink: e.target.value})} />
          <input placeholder="GitHub Link" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.githubLink} onChange={e => setFormData({...formData, githubLink: e.target.value})} />
          <button onClick={handleSave} type="button" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">Save Project</button>
        </div>
      </Modal>
    </section>
  );
};

const SkillsSection: React.FC = () => {
  const [skillGroups, setSkillGroups] = usePersistedState<SkillGroup[]>('ast_skills_data', [
    { id: '1', title: "Programming", skills: ["JavaScript", "React.js", "Java", "HTML", "CSS"] },
    { id: '2', title: "Design", skills: ["UI/UX Design", "Responsive Design", "Tailwind CSS"] },
    { id: '3', title: "HR & Operations", skills: ["Recruitment", "Onboarding", "Engagement"] }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', skills: '' });

  return (
    <section id="skills" className="py-32 px-6 bg-dark-900/80">
      <div className="container mx-auto">
        <SectionTitle title="Skills" subtitle="A multi-disciplinary approach to engineering." onAdd={() => { setEditingIdx(null); setFormData({ title: '', skills: '' }); setIsModalOpen(true); }} />
        <div className="grid lg:grid-cols-3 gap-10">
          {skillGroups.map((group, idx) => (
            <TiltCard key={group.id}>
              <div className="h-full p-10 rounded-[2.5rem] bg-dark-800 border border-white/5 shadow-2xl relative group">
                <div className="absolute top-8 right-8 flex gap-3 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => { setEditingIdx(idx); setFormData({ title: group.title, skills: group.skills.join(', ') }); setIsModalOpen(true); }} type="button" className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white cursor-pointer"><Edit3 size={16} /></button>
                  <button onClick={() => setSkillGroups(skillGroups.filter((_, i) => i !== idx))} type="button" className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white cursor-pointer"><Trash2 size={16} /></button>
                </div>
                <div className="mb-8 p-4 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
                  <Cpu />
                </div>
                <h3 className="text-2xl font-black mb-8 text-white">{group.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {group.skills.map((skill, i) => (
                    <span key={i} className="px-5 py-3 rounded-2xl border border-white/5 bg-dark-700 text-sm font-bold text-gray-400 hover:text-white hover:border-blue-500 transition-all">{skill}</span>
                  ))}
                </div>
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingIdx !== null ? "Edit Skill Group" : "Add Skill Group"}>
        <div className="space-y-4">
          <input placeholder="Group Title" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          <textarea placeholder="Skills (comma separated)" className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none h-32" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} />
          <button onClick={() => {
            const newGroup = {
              id: editingIdx !== null ? skillGroups[editingIdx].id : Date.now().toString(),
              title: formData.title,
              skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean)
            };
            if (editingIdx !== null) {
              const updated = [...skillGroups];
              updated[editingIdx] = newGroup;
              setSkillGroups(updated);
            } else {
              setSkillGroups([...skillGroups, newGroup]);
            }
            setIsModalOpen(false);
          }} type="button" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold">Save Skills</button>
        </div>
      </Modal>
    </section>
  );
};

const AchievementsSection: React.FC = () => {
  const achievements = [
    {
      title: "Certificate – Code Quest 2025",
      description: "Strengthened problem-solving, coding fundamentals, and software development skills."
    }
  ];
  return (
    <section id="achievements" className="py-32 px-6">
      <div className="container mx-auto">
        <SectionTitle title="Achievements" />
        <div className="max-w-4xl">
          {achievements.map((item, idx) => (
            <TiltCard key={idx}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row items-center gap-10 p-10 lg:p-12 rounded-[2.5rem] bg-dark-800 border border-white/5 hover:border-blue-500/30 transition-all shadow-2xl group"
              >
                <div className="p-8 rounded-[2rem] bg-purple-500/10 text-purple-500 group-hover:bg-purple-500 group-hover:text-white transition-all shadow-lg flex-shrink-0">
                  <Award size={64} />
                </div>
                <div>
                  <h3 className="text-3xl font-black mb-4 text-white leading-tight">{item.title}</h3>
                  <p className="text-gray-400 text-lg leading-relaxed font-light">{item.description}</p>
                </div>
              </motion.div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const ContactSection: React.FC = () => {
  const socials = [
    { name: 'Email', icon: <Mail />, value: 'abdu.ssamietahir2006@gmail.com', href: 'mailto:abdu.ssamietahir2006@gmail.com', color: 'bg-red-500/10 text-red-400 border-red-500/20' },
    { name: 'LinkedIn', icon: <Linkedin />, value: 'Abdus Samie Tahir', href: 'https://www.linkedin.com/in/abdus-samie-tahir-3648aa320', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { name: 'GitHub', icon: <Github />, value: '@abdussamietahir2006-stack', href: 'https://github.com/abdussamietahir2006-stack', color: 'bg-white/5 text-white border-white/10' }
  ];
  return (
    <section id="contact" className="py-32 px-6 bg-dark-900/80 relative">
      <div className="container mx-auto">
        <SectionTitle title="Let's Connect" subtitle="Collaboration starts with a conversation." align="center" />
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {socials.map((social, idx) => (
            <TiltCard key={idx}>
              <motion.a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`p-10 rounded-[2.5rem] bg-dark-800 border ${social.color} flex flex-col items-center text-center group hover:scale-[1.05] hover:-translate-y-4 transition-all shadow-2xl h-full`}
              >
                <div className={`p-6 rounded-2xl ${social.color} mb-8 shadow-lg group-hover:rotate-12 transition-transform`}>
                  {React.cloneElement(social.icon as React.ReactElement<any>, { size: 40 })}
                </div>
                <h3 className="text-xl font-black mb-3 text-white uppercase tracking-widest">{social.name}</h3>
                <p className="text-gray-500 text-sm break-all font-mono opacity-60 mb-6">{social.value}</p>
                <div className="mt-auto flex items-center gap-2 text-blue-500 font-bold">
                  Send Message <ChevronRight size={16} />
                </div>
              </motion.a>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer: React.FC = () => (
  <footer className="py-20 border-t border-white/5 text-center text-gray-600 bg-dark-900 relative">
    <div className="container mx-auto px-6">
      <p className="mb-10 text-sm tracking-widest uppercase font-mono">Designed & Built with <Heart size={14} className="inline text-red-500 mx-1 animate-pulse" /> by Abdus Samie Tahir</p>
      <div className="flex justify-center space-x-10 mb-10">
        <a href="https://github.com/abdussamietahir2006-stack" className="text-gray-500 hover:text-white transition-colors hover:scale-125"><Github size={24} /></a>
        <a href="https://www.linkedin.com/in/abdus-samie-tahir-3648aa320" className="text-gray-500 hover:text-blue-500 transition-colors hover:scale-125"><Linkedin size={24} /></a>
        <a href="mailto:abdu.ssamietahir2006@gmail.com" className="text-gray-500 hover:text-red-500 transition-colors hover:scale-125"><Mail size={24} /></a>
      </div>
      <p className="text-xs opacity-40">© {new Date().getFullYear()} Abdus Samie Tahir. All rights reserved.</p>
    </div>
  </footer>
);

const App: React.FC = () => {
  return (
    <div className="font-sans selection:bg-blue-500 selection:text-white bg-dark-900">
      <Navbar />
      <main className="relative">
        <Hero />
        <About />
        <ExperienceSection />
        <EducationSection />
        <ProjectsSection />
        <SkillsSection />
        <AchievementsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
