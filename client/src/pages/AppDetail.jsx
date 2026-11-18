
import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  fetchApplicationById,
  updateApplication,
  deleteApplication,
} from '../api/application';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import {
  ExternalLink,
  Trash2,
  Edit3,
  Plus,
  Calendar,
} from 'lucide-react';

const ALL_STATUSES = [
  'Wishlist',
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Accepted',
  'Rejected',
  'Withdrawn',
];

const AppDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [noteText, setNoteText] = useState('');
  const [interviewType, setInterviewType] = useState('');
  const [interviewDate, setInterviewDate] = useState('');

  // Fetch application
  useEffect(() => {
    fetchApplicationById(id)
      .then((data) => {
        setApp(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Application not found.');
        setLoading(false);
      });
  }, [id]);

  // Change status
  const handleStatusChange = async (newStatus) => {
    const updatedHistory = [
      ...(app.history || []),
      {
        status: newStatus,
        at: new Date().toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        }),
      },
    ];

    const updated = await updateApplication(id, {
      status: newStatus,
      history: updatedHistory,
    });

    setApp(updated);
  };

  // Add note
  const handleAddNote = async (e) => {
    e.preventDefault();

    if (!noteText.trim()) return;

    const newNote = {
      id: Date.now().toString(),
      text: noteText,
      createdAt: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }),
    };

    const updated = await updateApplication(id, {
      notes: [...(app.notes || []), newNote],
    });

    setApp(updated);
    setNoteText('');
  };

  // Add interview
  const handleAddInterview = async (e) => {
    e.preventDefault();

    if (!interviewType.trim() || !interviewDate) return;

    const newInterview = {
      id: Date.now().toString(),
      type: interviewType,
      scheduledAt: interviewDate,
    };

    const updated = await updateApplication(id, {
      interviews: [...(app.interviews || []), newInterview],
    });

    setApp(updated);
    setInterviewType('');
    setInterviewDate('');
  };

  // Delete application
  const handleDelete = async () => {
    await deleteApplication(id);
    navigate('/applications');
  };

  // Loading
  if (loading) {
    return (
      <div className="p-8 text-gray-500">
        Loading application details...
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div className="p-8 text-rose-600 bg-rose-50 rounded-xl">
        {error}
      </div>
    );
  }

  const initials = app.company.slice(0, 2).toUpperCase();

  const sortedStatusHistory = [...(app.history || [])].sort((a, b) => {
    const indexA = ALL_STATUSES.indexOf(a.status);
    const indexB = ALL_STATUSES.indexOf(b.status);
    const safeIndexA = indexA === -1 ? ALL_STATUSES.length : indexA;
    const safeIndexB = indexB === -1 ? ALL_STATUSES.length : indexB;

    return safeIndexA - safeIndexB;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-xl border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-indigo-50 text-primary font-bold text-xl flex items-center justify-center border border-indigo-100">
            {initials}
          </div>

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {app.role}
            </h1>
            <p className="text-gray-600 font-medium">
              {app.company} ·{' '}
              <span className="text-gray-500">{app.location}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          {/* STATUS DROPDOWN */}

          <select
            value={app.status}
            onChange={(e) =>
              handleStatusChange(e.target.value)
            }
            className="border rounded-lg px-3 py-2 text-sm font-medium bg-gray-50 hover:bg-white focus:ring-2 focus:ring-primary outline-none"
          >
            {ALL_STATUSES.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>

          {/* EDIT BUTTON */}

          <Link
            to={'/applications/' + id + '/edit'}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-gray-50"
          >
            <Edit3 size={16} />
            Edit
          </Link>

          {/* DELETE BUTTON */}

          <button
            onClick={() =>
              setShowDeleteModal(true)
            }
            className="flex items-center gap-2 px-4 py-2 border border-rose-200 text-rose-600 rounded-lg text-sm font-medium hover:bg-rose-50"
          >
            <Trash2 size={16} />
            Delete
          </button>

        </div>
      </div>

      {/* ================= MAIN CONTENT ================= */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ================= LEFT COLUMN ================= */}

        <div className="lg:col-span-2 space-y-6">

          {/* DETAILS */}

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">

            <h2 className="text-lg font-bold text-gray-900">
              Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm border-b pb-4">

              {/* JOB LINK */}

              <div>
                <span className="text-gray-500 block">
                  Job link
                </span>

                {app.jobUrl ? (
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline flex items-center gap-1 font-medium truncate mt-1"
                  >
                    {app.jobUrl}
                    <ExternalLink size={14} />
                  </a>
                ) : (
                  <span className="text-gray-400 mt-1 block">
                    Not provided
                  </span>
                )}
              </div>

              {/* SOURCE */}

              <div>
                <span className="text-gray-500 block">
                  Source
                </span>

                <span className="font-medium text-gray-900 mt-1 block">
                  {app.source || 'Direct'}
                </span>
              </div>

              {/* APPLIED DATE */}

              <div>
                <span className="text-gray-500 block">
                  Applied date
                </span>

                <span className="font-medium text-gray-900 mt-1 block">
                  {app.appliedDate}
                </span>
              </div>

            </div>

            {/* JOB DESCRIPTION */}

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Job description
              </h3>

              <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                {app.jobDescription ||
                  'No job description added yet.'}
              </p>
            </div>

          </div>

          {/* ================= NOTES ================= */}

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">

            <h2 className="text-lg font-bold text-gray-900">
              Notes
            </h2>

            <form
              onSubmit={handleAddNote}
              className="flex gap-2"
            >

              <input
                type="text"
                placeholder="Add a new note..."
                value={noteText}
                onChange={(e) =>
                  setNoteText(e.target.value)
                }
                className="flex-1 border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />

              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700"
              >
                Add Note
              </button>

            </form>

            <div className="space-y-3 pt-2">

              {(app.notes || []).length === 0 && (
                <p className="text-sm text-gray-400">
                  No notes yet.
                </p>
              )}

              {(app.notes || []).map((note) => (
                <div
                  key={note.id}
                  className="p-3.5 bg-gray-50 rounded-lg border text-sm"
                >

                  <p className="text-gray-800">
                    {note.text}
                  </p>

                  <span className="text-xs text-gray-400 mt-1 block">
                    {note.createdAt}
                  </span>

                </div>
              ))}

            </div>

          </div>

        </div>

        {/* ================= RIGHT COLUMN ================= */}

        <div className="space-y-6">

          {/* ================= STATUS HISTORY ================= */}

          <div className="bg-white p-6 rounded-xl border shadow-sm">

            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Status history
            </h2>

            <div className="relative pl-4 border-l-2 border-indigo-100 space-y-6">

              {sortedStatusHistory.map(
                (item, idx) => (
                  <div
                    key={idx}
                    className="relative"
                  >

                    {/* TIMELINE DOT */}

                    <div className="w-3 h-3 rounded-full bg-primary absolute -left-[23px] top-1.5 ring-4 ring-white" />

                    <div className="flex items-center justify-between">

                      <StatusBadge
                        status={item.status}
                      />

                      <span className="text-xs text-gray-500">
                        {item.at}
                      </span>

                    </div>

                  </div>
                )
              )}

            </div>

          </div>

          {/* ================= INTERVIEWS ================= */}

          <div className="bg-white p-6 rounded-xl border shadow-sm space-y-4">

            <h2 className="text-lg font-bold text-gray-900">
              Interviews
            </h2>

            <div className="space-y-3">

              {(app.interviews || []).map(
                (iv) => (
                  <div
                    key={iv.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border text-sm"
                  >

                    <div className="flex items-center gap-2.5">

                      <Calendar
                        size={16}
                        className="text-primary"
                      />

                      <span className="font-medium text-gray-900">
                        {iv.type}
                      </span>

                    </div>

                    <span className="text-gray-500 text-xs">
                      {iv.scheduledAt}
                    </span>

                  </div>
                )
              )}

            </div>

            {/* ADD INTERVIEW */}

            <form
              onSubmit={handleAddInterview}
              className="space-y-2 pt-2 border-t"
            >

              <input
                type="text"
                placeholder="Interview round (e.g. Technical)"
                value={interviewType}
                onChange={(e) =>
                  setInterviewType(e.target.value)
                }
                className="w-full border rounded-lg px-3 py-2 text-sm"
              />

              <div className="flex gap-2">

                <input
                  type="date"
                  value={interviewDate}
                  onChange={(e) =>
                    setInterviewDate(e.target.value)
                  }
                  className="flex-1 border rounded-lg px-3 py-2 text-sm"
                />

                <button
                  type="submit"
                  className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center gap-1"
                >
                  <Plus size={16} />
                  Add
                </button>

              </div>

            </form>

          </div>

        </div>

      </div>

      {/* ================= DELETE CONFIRMATION ================= */}

      <ConfirmDialog
        isOpen={showDeleteModal}
        title="Delete Application"
        message={'Are you sure you want to delete your application for ' + app.role + ' at ' + app.company + '? This action cannot be undone.'}
        onConfirm={handleDelete}
        onCancel={() =>
          setShowDeleteModal(false)
        }
      />

    </div>
  );
};

export default AppDetail;