import { useState } from 'react';
import usePortfolioStore from '../../store/usePortfolioStore';
import './ResumeModal.css';

/**
 * ResumeModal - Parchment-style resume overlay
 * Displays when gate opens, with animated scroll unroll effect
 */
export default function ResumeModal() {
    const showResume = usePortfolioStore((state) => state.showResume);
    const toggleResume = usePortfolioStore((state) => state.toggleResume);
    const [activeSection, setActiveSection] = useState('about');

    if (!showResume) return null;

    const sections = {
        about: {
            title: 'About Me',
            content: `
        A passionate Software Engineer with expertise in building 
        modern web applications. I love crafting immersive digital 
        experiences that blend creativity with technical excellence.
        
        When I'm not coding, you'll find me exploring new technologies,
        contributing to open source, or watching Harry Potter movies.
      `
        },
        skills: {
            title: 'Skills & Expertise',
            items: [
                { category: 'Frontend', skills: ['React', 'Three.js', 'TypeScript', 'CSS/SCSS'] },
                { category: 'Backend', skills: ['Node.js', 'Python', 'PostgreSQL', 'REST APIs'] },
                { category: 'Tools', skills: ['Git', 'Docker', 'AWS', 'CI/CD'] },
            ]
        },
        experience: {
            title: 'Experience',
            items: [
                {
                    role: 'Senior Software Engineer',
                    company: 'Magic Tech Co.',
                    period: '2022 - Present',
                    description: 'Leading development of immersive web experiences'
                },
                {
                    role: 'Software Engineer',
                    company: 'Wizard Systems',
                    period: '2020 - 2022',
                    description: 'Built scalable applications and APIs'
                },
            ]
        },
        contact: {
            title: 'Contact',
            items: [
                { label: 'Email', value: 'vaibhav@example.com' },
                { label: 'LinkedIn', value: 'linkedin.com/in/vaibhav' },
                { label: 'GitHub', value: 'github.com/vaibhav' },
            ]
        }
    };

    return (
        <div className="resume-modal-overlay" onClick={toggleResume}>
            <div className="resume-modal" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="resume-close-btn" onClick={toggleResume}>
                    ✕
                </button>

                {/* Parchment Header */}
                <div className="resume-header">
                    <h1 className="resume-name">Vaibhav Bahadur</h1>
                    <p className="resume-title">Software Engineer</p>
                    <div className="header-decoration">✦ ✦ ✦</div>
                </div>

                {/* Navigation Tabs */}
                <nav className="resume-nav">
                    {Object.keys(sections).map((key) => (
                        <button
                            key={key}
                            className={`nav-tab ${activeSection === key ? 'active' : ''}`}
                            onClick={() => setActiveSection(key)}
                        >
                            {sections[key].title}
                        </button>
                    ))}
                </nav>

                {/* Content Area */}
                <div className="resume-content">
                    {activeSection === 'about' && (
                        <div className="section-about">
                            <p>{sections.about.content}</p>
                        </div>
                    )}

                    {activeSection === 'skills' && (
                        <div className="section-skills">
                            {sections.skills.items.map((cat, i) => (
                                <div key={i} className="skill-category">
                                    <h3>{cat.category}</h3>
                                    <div className="skill-tags">
                                        {cat.skills.map((skill, j) => (
                                            <span key={j} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'experience' && (
                        <div className="section-experience">
                            {sections.experience.items.map((exp, i) => (
                                <div key={i} className="experience-item">
                                    <h3>{exp.role}</h3>
                                    <p className="company">{exp.company}</p>
                                    <p className="period">{exp.period}</p>
                                    <p className="description">{exp.description}</p>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeSection === 'contact' && (
                        <div className="section-contact">
                            {sections.contact.items.map((item, i) => (
                                <div key={i} className="contact-item">
                                    <span className="label">{item.label}:</span>
                                    <span className="value">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Download Button */}
                <div className="resume-footer">
                    <button className="download-btn">
                        📜 Download Resume PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
