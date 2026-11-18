import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { createApplication, fetchApplicationById, updateApplication } from '../api/application';

const ALL_STATUSES = [
  'Wishlist', 'Applied', 'Screening', 'Interview', 'Offer', 'Accepted', 'Rejected', 'Withdrawn'
];

const AppForm = () => {
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    status: 'Applied',
    jobUrl: '',
    source: '',
    appliedDate: new Date().toISOString().split('T')[0],
    jobDescription: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditMode) {
      fetchApplicationById(id).then((data) => setFormData(data));
    }
  }, [id, isEditMode]);

  const validate = () => {
    const newErrors = {};
    if (!formData.company.trim()) newErrors.company = 'Company is required';
    if (!formData.role.trim()) newErrors.role = 'Role is required';
    if (formData.jobUrl.trim()) {
      try {
        new URL(formData.jobUrl);
      } catch {
        newErrors.jobUrl = 'Enter a valid URL (e.g. https://example.com)';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditMode) {
      await updateApplication(id, formData);
      navigate(`/applications/${id}`);
    } else {
      await createApplication(formData);
      navigate('/applications');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="text-sm text-gray-500">
        <Link to="/applications" className="hover:underline">Applications</Link> / <span className="text-gray-900 font-medium">{isEditMode ? 'Edit' : 'New'}</span>
      </div>

      <div className="bg-white p-8 rounded-xl border shadow-sm">
        <h2 className="text-2xl font-bold mb-6">{isEditMode ? 'Edit application' : 'Add application'}</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company *</label>
              <input
                type="text"
                className={`w-full border rounded-lg p-2.5 text-sm ${errors.company ? 'border-rose-500' : ''}`}
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
              {errors.company && <p className="text-xs text-rose-600 mt-1">{errors.company}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
              <input
                type="text"
                className={`w-full border rounded-lg p-2.5 text-sm ${errors.role ? 'border-rose-500' : ''}`}
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              />
              {errors.role && <p className="text-xs text-rose-600 mt-1">{errors.role}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Remote, London, New York"
                className="w-full border rounded-lg p-2.5 text-sm"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border rounded-lg p-2.5 text-sm bg-white"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {ALL_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Job URL</label>
              <input
                type="text"
                placeholder="https://..."
                className={`w-full border rounded-lg p-2.5 text-sm ${errors.jobUrl ? 'border-rose-500' : ''}`}
                value={formData.jobUrl}
                onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
              />
              {errors.jobUrl && <p className="text-xs text-rose-600 mt-1">{errors.jobUrl}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
              <input
                type="text"
                placeholder="LinkedIn, Referral..."
                className="w-full border rounded-lg p-2.5 text-sm"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Applied date</label>
              <input
                type="date"
                className="w-full border rounded-lg p-2.5 text-sm"
                value={formData.appliedDate}
                onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Job description</label>
            <textarea
              rows="5"
              className="w-full border rounded-lg p-2.5 text-sm"
              placeholder="Paste the job description here..."
              value={formData.jobDescription}
              onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-indigo-700"
            >
              Save application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppForm;