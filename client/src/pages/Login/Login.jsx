import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginSchema, validateSingleField } from '../../utils/authValidation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AlertCircle } from 'lucide-react';
import './login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    if (touched[field]) {
      const errors = validateSingleField(loginSchema, updatedData, field);
      setFieldErrors((prev) => ({ ...prev, [field]: errors }));
    }
  };

  const handleBlur = (field) => {
    const nextTouched = { ...touched, [field]: true };
    setTouched(nextTouched);
    const errors = validateSingleField(loginSchema, formData, field);
    setFieldErrors((prev) => ({ ...prev, [field]: errors }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setServerError('');

    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!formattedErrors[field]) formattedErrors[field] = [];
        formattedErrors[field].push(issue.message);
      });
      setFieldErrors(formattedErrors);
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Failed to sign in. Is json-server running on port 5000?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="bg-indigo-950 text-white p-12 flex flex-col justify-between sideMarketingPanel-r md:h-full md:overflow-hidden">
        <div className="flex items-center gap-2.5" style={{ width: '15rem' }}>
          <div className="w-16 h-16 rounded-lg text-white font-bold flex items-center justify-center transparentImage" style={{ width: '100%' }}>
            <img src="src\\assets\\logo3.png" alt="JobTrail Logo" />
          </div>
        </div>
        <div className="space-y-4 max-w-md my-12">
          <h1 className="text-4xl font-bold leading-tight">Every application on clear trial</h1>
          <p className="text-indigo-200 text-sm">
            Organize application track interveiws and focus on the roles that matter most.
          </p>
        </div>
        <p className="text-xs text-indigo-400"></p>
      </div>

      <div className="flex items-center justify-center p-8 md:h-full overflow-y-auto">
        <div className="w-full max-w-sm space-y-5">
          <h2 className="text-2xl font-bold text-gray-900">Welcome Back</h2>

          {serverError && (
            <div className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
              <AlertCircle size={16} className="mt-0.5" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4" noValidate>
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                placeholder="jane@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full rounded-lg border p-2.5 text-sm ${fieldErrors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'}`}
              />
              {fieldErrors.email && <p className="mt-1 text-xs text-rose-600">{fieldErrors.email[0]}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full rounded-lg border p-2.5 pr-10 text-sm ${fieldErrors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'}`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>

              <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">
                Password must be at least 8 characters with uppercase, lowercase, number, and special character.
              </p>

              {fieldErrors.password && (
                <ul className="mt-2 space-y-1 rounded-lg border border-rose-100 bg-rose-50 p-2.5 text-xs text-rose-600">
                  {fieldErrors.password.map((msg, idx) => <li key={idx}>• {msg}</li>)}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Sign in'}
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-slate-600">
            New here? <Link to="/register" className="font-medium text-indigo-600 hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;