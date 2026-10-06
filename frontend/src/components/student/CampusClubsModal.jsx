import React from 'react';
import { X, Users, Award, Code, Cpu, Music, Trophy } from 'lucide-react';

export default function CampusClubsModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const clubs = [
    {
      id: 1,
      name: "IEEE Student Branch",
      category: "Technical Society",
      icon: <Cpu size={20} />,
      color: "blue",
      desc: "Workshops on microelectronics, paper publications, global conferences, and technical competitions."
    },
    {
      id: 2,
      name: "CodeCrafters Club",
      category: "Programming & Dev",
      icon: <Code size={20} />,
      color: "purple",
      desc: "Competitive programming, open-source projects, web/mobile app hackathons, and algorithmic bootcamps."
    },
    {
      id: 3,
      name: "Robotics & AI Guild",
      category: "Hardware & Robotics",
      icon: <Award size={20} />,
      color: "amber",
      desc: "Building autonomous rovers, drone design, computer vision projects, and national robo-wars."
    },
    {
      id: 4,
      name: "Tarang Cultural Society",
      category: "Music, Dance & Drama",
      icon: <Music size={20} />,
      color: "pink",
      desc: "Annual cultural festival management, acoustic band performances, theater drama, and choreography."
    },
    {
      id: 5,
      name: "Campus Sports Council",
      category: "Athletics & Sports",
      icon: <Trophy size={20} />,
      color: "green",
      desc: "Training camps in badminton, cricket, basketball, volleyball, table tennis, and athletics."
    }
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-md" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="stat-icon green" style={{ width: '36px', height: '36px' }}>
              <Users size={18} />
            </div>
            <div>
              <h3 className="modal-title">Student Clubs & Societies</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Explore student organizations and co-curricular communities
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            {clubs.map((club) => (
              <div key={club.id} className="campus-club-card">
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                  <div className={`stat-icon ${club.color}`} style={{ width: '38px', height: '38px', flexShrink: 0 }}>
                    {club.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600 }}>{club.name}</h4>
                      <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>{club.category}</span>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>
                      {club.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
