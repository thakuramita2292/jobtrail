import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { registerSchema, checkPasswordRules, validateSingleField } from '../../utils/authValidation';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';
import "./register.css";

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({});

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const passwordRules = checkPasswordRules(formData.password);

  const handleChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    if (touched[field]) {
      const errors = validateSingleField(registerSchema, updatedData, field);
      setFieldErrors((prev) => ({ ...prev, [field]: errors }));
    }

    if (field === 'password' && touched.confirmPassword) {
      const confirmErrors = validateSingleField(registerSchema, updatedData, 'confirmPassword');
      setFieldErrors((prev) => ({ ...prev, confirmPassword: confirmErrors }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const errors = validateSingleField(registerSchema, formData, field);
    setFieldErrors((prev) => ({ ...prev, [field]: errors }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setServerError('');

    const result = registerSchema.safeParse(formData);
    if (!result.success) {
      const formattedErrors = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0];
        if (!formattedErrors[field]) formattedErrors[field] = [];
        formattedErrors[field].push(issue.message);
      });
      setFieldErrors(formattedErrors);
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      navigate('/dashboard');
    } catch (err) {
      setServerError(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen md:h-screen md:overflow-hidden grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="bg-indigo-950 text-white p-12 flex flex-col justify-between sideMarketingPanel-r md:h-full md:overflow-hidden">
        <div className="flex items-center gap-2.5" style={{ width: "15rem" }}>
          <div className="w-16 h-16 rounded-lg text-white font-bold flex items-center justify-center transparentImage " style ={{ width: "100%" }}>
            <img  src="src\assets\logo3.png" alt="JobTrail Logo"/>
          </div>
        </div>
        <div className="space-y-4 max-w-md my-12">
          <h1 className="text-4xl font-bold leading-tight">Start your search with a plan.</h1>
          <p className="text-indigo-200 text-sm">
            Organize your job hunt, prepare for interviews, and land your next role faster.
          </p>
        </div>
        <p className="text-xs text-indigo-400"></p>
      </div>

      <div className="flex items-center justify-center p-8 md:h-full overflow-y-auto">
        <div className="w-full max-w-sm space-y-5 h-full">
          <h2 className="text-2xl font-bold text-gray-900">Create your account</h2>

          {serverError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-sm flex items-center gap-2">
              <AlertCircle size={16} className="shrink-0" />
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                className={`w-full border rounded-lg p-2.5 text-sm ${
                  fieldErrors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {fieldErrors.name && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.name[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="your@gmail.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                className={`w-full border rounded-lg p-2.5 text-sm ${
                  fieldErrors.email ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                }`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.email[0]}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => handleBlur('password')}
                  className={`w-full border rounded-lg p-2.5 pr-10 text-sm ${
                    fieldErrors.password ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>

              {fieldErrors.password && (
                <ul className="mt-2 space-y-1 text-xs text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                  {fieldErrors.password.map((errMsg, idx) => (
                    <li key={idx}>• {errMsg}</li>
                  ))}
                </ul>
              )}

              <div className="mt-2 p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
                <p className="text-xs font-semibold text-slate-700 mb-1">Password requirements:</p>
                {passwordRules.map((rule, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center gap-2 text-xs ${
                      rule.met ? 'text-emerald-600 font-medium' : 'text-slate-500'
                    }`}
                  >
                    {rule.met ? (
                      <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                    ) : (
                      <Circle size={14} className="text-slate-300 shrink-0" />
                    )}
                    <span>{rule.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  onBlur={() => handleBlur('confirmPassword')}
                  className={`w-full border rounded-lg p-2.5 pr-10 text-sm ${
                    fieldErrors.confirmPassword ? 'border-rose-500 bg-rose-50/20' : 'border-slate-300'
                  }`}
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 flex items-center justify-center"
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                </button>
              </div>
              {fieldErrors.confirmPassword && (
                <p className="text-xs text-rose-600 mt-1 font-medium">{fieldErrors.confirmPassword[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="text-sm text-center text-gray-600">
            Already have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
