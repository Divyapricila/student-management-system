import React, { useState, useEffect } from 'react';
import { BookOpen, Download, FileText, Calendar, HardDrive, Search, ExternalLink } from 'lucide-react';
import smartCampusService from '../../services/smartCampusService';

export default function StudentMaterialsPage({ onShowToast }) {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('ALL');

  useEffect(() => {
    let mounted = true;
    smartCampusService.getMaterials()
      .then((data) => {
        if (mounted) {
          setMaterials(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (mounted) {
          setLoading(false);
          if (onShowToast) onShowToast('Failed to load study materials', 'error');
        }
      });
    return () => { mounted = false; };
  }, []);

  const handleDownload = (material) => {
    // Generate simple dynamic downloadable text/pdf note
    const element = document.createElement('a');
    const file = new Blob([
      `=== ${material.title} ===\nSubject: ${material.subjectCode} - ${material.subjectName}\nUploaded: ${material.uploadedDate}\n\n${material.description}\n\n[Official Course Material - EduManage Smart Campus System]`
    ], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = material.fileName || `${material.title.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    if (onShowToast) onShowToast(`Downloaded: ${material.title}`, 'success');
  };

  const filteredMaterials = materials.filter((m) => {
    const matchSubject = selectedSubject === 'ALL' || m.subjectCode === selectedSubject;
    const matchSearch = !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.subjectName.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  const subjects = Array.from(new Set(materials.map(m => m.subjectCode)));

  return (
    <div className="materials-page">
      {/* Search & Filter Header */}
      <div className="academic-controls-card shadow-sm">
        <div className="controls-left" style={{ flex: 1 }}>
          <div className="search-bar-wrap" style={{ maxWidth: '320px', width: '100%' }}>
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="styled-search-input"
            />
          </div>

          <div className="select-wrapper">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="styled-select"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="controls-right">
          <span className="badge-pill">Semester 5 ECE Curriculum</span>
        </div>
      </div>

      {loading ? (
        <div className="grid-2-col" style={{ gap: '1.25rem', marginTop: '1.5rem' }}>
          <div className="skeleton-card" style={{ height: '180px' }}></div>
          <div className="skeleton-card" style={{ height: '180px' }}></div>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="empty-state-card shadow-sm">
          <BookOpen size={48} className="text-muted" />
          <h3>No Study Materials Found</h3>
          <p>No materials matched your filter query.</p>
        </div>
      ) : (
        <div className="materials-grid">
          {filteredMaterials.map((mat) => (
            <div key={mat.id} className="material-card shadow-sm">
              <div className="material-card-header">
                <span className="subject-code-badge">{mat.subjectCode}</span>
                <span className="file-type-badge">{mat.fileType || 'PDF'}</span>
              </div>

              <h4 className="material-title">{mat.title}</h4>
              <p className="material-desc">{mat.description}</p>

              <div className="material-meta-row">
                <div className="meta-item">
                  <Calendar size={13} className="text-muted" />
                  <span>{mat.uploadedDate}</span>
                </div>
                <div className="meta-item">
                  <HardDrive size={13} className="text-muted" />
                  <span>{mat.fileSize || '2.4 MB'}</span>
                </div>
              </div>

              <div className="material-card-footer">
                <button
                  className="btn btn-primary btn-sm w-full"
                  onClick={() => handleDownload(mat)}
                >
                  <Download size={14} />
                  <span>Download Resource</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
