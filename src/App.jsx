import React, { useEffect, useState } from 'react';
// import { auth } from "./firebase";          
// import { signOut as firebaseSignOut } from "firebase/auth";

import {
  Refresh as RefreshCw,
  Warning as AlertCircle,
  Lock as Lock,
  Phone as Phone,
  Person as User,
  Settings as Settings,
  Description as FileText,
  Logout as LogOut,
  ChevronLeft as ChevronLeft,
} from '@mui/icons-material';


import {
  ThemeProvider,
  createTheme,
  responsiveFontSizes,
  CssBaseline,
  Container,
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  IconButton,
  TextField,
  InputAdornment,
  CircularProgress,
  Switch,
  FormControlLabel,
  Grid,
  Card,
  CardContent,
  CardActions,
  Pagination,
  Stack,
} from '@mui/material';

function getGreeting() {
  try {
    const h = new Date().getHours();
    if (h < 5) return 'Good night';
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  } catch {
    return 'Hello';
  }
}

let theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#6750A4' }, 
    secondary: { main: '#B583FF' },
    background: { default: '#F7F5FF', paper: '#FFF' },
    error: { main: '#B00020' },
    warning: { main: '#FFB020' },
  },
  shape: { borderRadius: 20 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: { border: '1px solid rgba(0,0,0,0.06)' },
      },
    },
    MuiButton: {
      styleOverrides: { root: { textTransform: 'none', borderRadius: 14 } },
      defaultProps: { disableElevation: true },
    },
  },
});
theme = responsiveFontSizes(theme);

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('menu');

  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('user');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.displayName) {
          setUser(parsed);
          setIsLoggedIn(true);
          setCurrentView('menu');
        }
      }
    } catch {}
  }, []);

  useEffect(() => {
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj);
    setIsLoggedIn(true);
    setCurrentView('menu');
    try {
      sessionStorage.setItem('user', JSON.stringify(userObj));
    } catch (e) {
      console.error('Failed to save user', e);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setCurrentView('menu');
    sessionStorage.removeItem('user');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {!isLoggedIn ? (
        <LoginScreen onLogin={handleLogin} isOnline={isOnline} />
      ) : (
        <Box sx={{ minHeight: '100vh', py: 6, bgcolor: 'background.default' }}>
          {currentView === 'menu' ? (
            <MenuScreen user={user} onNavigate={setCurrentView} onLogout={handleLogout} isOnline={isOnline} />
          ) : currentView === 'posts' ? (
            <PostsScreen onBack={() => setCurrentView('menu')} onLogout={handleLogout} user={user} isOnline={isOnline} />
          ) : currentView === 'profile' ? (
            <ProfileScreen user={user} setUser={setUser} onBack={() => setCurrentView('menu')} onLogout={handleLogout} isOnline={isOnline} />
          ) : (
            <SettingsScreen user={user} onBack={() => setCurrentView('menu')} onLogout={handleLogout} isOnline={isOnline} />
          )}
        </Box>
      )}
    </ThemeProvider>
  );
}

function AppContainer({ children }) {
  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 3 }}>{children}</Box>
    </Container>
  );
}

function FacegramHeader({ onLogout, title = 'Facegram', user = null }) {
  const firstName = user?.firstName || '';
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: 3, mb: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Box>
          <Typography
  variant="h5"
  fontWeight={800}
  sx={{
    background: 'linear-gradient(90deg, #f58529, #dd2a7b, #833ab4, #5851db)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  }}
>
  Facegram
</Typography>


         
        </Box>
        {onLogout && (
          <Button variant="outlined" color="error" startIcon={<LogOut />} sx={{ borderRadius: 3 }}  onClick={onLogout}  >
          </Button>
        )}
      </Box>
    </Paper>
  );
}

function LoginScreen({ onLogin, isOnline }) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [city, setCity] = useState('');
  const [showProfileForm, setShowProfileForm] = useState(false);

  const validateMobile = (number) => /^[6-9]\d{9}$/.test(number);

  const handleSendOtp = () => {
    if (!isOnline) {
      alert('You are offline — cannot send OTP. Please connect to the internet.');
      return;
    }
    setErrors({});
    if (!mobileNumber) {
      setErrors({ mobile: 'Mobile number is required' });
      return;
    }
    if (!validateMobile(mobileNumber)) {
      setErrors({ mobile: 'Please enter a valid 10-digit mobile number' });
      return;
    }
    const mockOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(mockOtp);
    setOtpSent(true);
    alert(`OTP sent successfully! Your OTP is: ${mockOtp}`);
  };

  const handleVerifyOtp = () => {
    setErrors({});
    setIsSubmitting(true);
    setTimeout(() => {
      if (!otp) {
        setErrors({ otp: 'OTP is required' });
        setIsSubmitting(false);
        return;
      }
      if (otp.length !== 6) {
        setErrors({ otp: 'OTP must be 6 digits' });
        setIsSubmitting(false);
        return;
      }
      if (otp !== generatedOtp) {
        setErrors({ otp: 'Invalid OTP. Please try again.' });
        setIsSubmitting(false);
        return;
      }
      setShowProfileForm(true);
      setIsSubmitting(false);
    }, 400);
  };

  const handleCompleteSignup = () => {
    setErrors({});
    if (!firstName) {
      setErrors({ profile: 'First name is required' });
      return;
    }
    const displayName = `${firstName}${lastName ? ' ' + lastName : ''}`.trim();
    const userObj = { firstName, lastName, city, displayName, phone: mobileNumber };
    onLogin(userObj);
  };

  const greeting = getGreeting();

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', p: 3,background: 'linear-gradient(135deg, #f58529 0%, #dd2a7b 40%, #833ab4 70%, #515bd4 100%)'
 }}>
      <Paper sx={{ width: '100%', maxWidth: 480, p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
    
          
          {!isOnline && (
            <Box sx={{ mt: 2 }}>
              <Paper sx={{ display: 'inline-flex', alignItems: 'center', gap: 1, px: 2, py: 0.5, bgcolor: 'warning.light' }}>
                <AlertCircle />
                <Typography variant="body2" color="warning.dark">You are offline — limited functionality</Typography>
              </Paper>
            </Box>
          )}
        </Box>

        {!showProfileForm ? (
          <Stack spacing={2}>
            <Typography variant="h4" fontWeight={800}>
            Signup with 
          </Typography>
           <Typography
  variant="h5"
  fontWeight={800}
  sx={{
    background: 'linear-gradient(90deg, #f58529, #dd2a7b, #833ab4, #5851db)',
    WebkitBackgroundClip: 'text',
    color: 'transparent',
  }}
>
  Facegram
</Typography>

            <TextField
              label="Mobile Number"
              placeholder="Enter 10-digit mobile number"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              InputProps={{ startAdornment: (<InputAdornment position="start"><Phone /></InputAdornment>) }}
              error={!!errors.mobile}
              helperText={errors.mobile}
              fullWidth
            />

            <Button variant="contained" disabled={!mobileNumber || otpSent} onClick={handleSendOtp} sx={{ py: 1.5 }}>
              {otpSent ? 'OTP Sent ✓' : 'Send OTP'}
            </Button>

            <TextField
              label="Enter OTP"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              inputProps={{ maxLength: 6, style: { letterSpacing: 6, textAlign: 'center', fontWeight: 700, fontSize: 18 } }}
              disabled={!otpSent}
              error={!!errors.otp}
              helperText={errors.otp}
              fullWidth
            />

            <Button variant="contained" disabled={!otpSent || !otp || isSubmitting} onClick={handleVerifyOtp} sx={{ py: 1.5 }}>
              {isSubmitting ? 'Verifying...' : 'Verify OTP'}
            </Button>

            {otpSent && (
              <Box sx={{ textAlign: 'center', mt: 1 }}>
                <Button variant="text" onClick={handleSendOtp} sx={{ textTransform: 'none' }}>Resend OTP</Button>
              </Box>
            )}
          </Stack>
        ) : (
          <Stack spacing={2}>
            {errors.profile && <Typography color="error">{errors.profile}</Typography>}

            <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
            <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
            <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="contained" onClick={handleCompleteSignup}>
                Complete & Continue
              </Button>
              <Button fullWidth variant="outlined" onClick={() => setShowProfileForm(false)}>
                Back
              </Button>
            </Box>
          </Stack>
        )}
      </Paper>
    </Box>
  );
}

function MenuScreen({ user, onNavigate, onLogout, isOnline }) {
  const menuItems = [
    { id: 'posts', title: 'Posts', icon: FileText, color: '#3b82f6', description: 'View all posts' },
    { id: 'profile', title: 'Profile', icon: User, color: '#7c3aed', description: 'Manage your profile' },
    { id: 'settings', title: 'Settings', icon: Settings, color: '#14b8a6', description: 'App settings' },
  ];

  const greeting = getGreeting();

  const safeNavigate = (id) => {
    if (!isOnline) {
      alert('You are offline — cannot navigate to another page. Please connect to the internet.');
      return;
    }
    onNavigate(id);
  };

  return (
    <AppContainer>
      <FacegramHeader onLogout={onLogout} user={user} />
<Paper sx={{ p: 1.5, borderRadius: 2, mb: 2 }}>
  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
    
   

    <Box sx={{ flex: 1 }}>
      <Typography
        variant="subtitle1"
        fontWeight={700}
        sx={{ lineHeight: 1.1 }}
      >
        {greeting}, {user?.firstName || user?.displayName} 👋
      </Typography>
    </Box>

    {!isOnline && (
      <Paper
        sx={{
          px: 1.5,
          py: 0.2,
          bgcolor: 'warning.light',
          borderRadius: 1.5,
        }}
      >
        <Typography
          variant="caption"
          color="warning.dark"
          fontWeight={600}
        >
          Offline
        </Typography>
      </Paper>
    )}

  </Box>
</Paper>

      

      <Grid container spacing={2}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card
                onClick={() => safeNavigate(item.id)}
                sx={{
                  p: 2,
                  borderRadius: 3,
                  cursor: isOnline ? 'pointer' : 'not-allowed',
                  opacity: isOnline ? 1 : 0.6,
                  ':hover': isOnline ? { boxShadow: 6, transform: 'translateY(-4px)' } : {},
                }}
                elevation={0}
              >
                <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ bgcolor: item.color, width: 56, height: 56, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon color="#fff" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight={700}>{item.title}</Typography>
                    <Typography color="text.secondary" variant="body2">{item.description}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </AppContainer>
  );
}

function PostsScreen({ onBack, onLogout, user, isOnline }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const postsPerPage = 10;
  const CACHE_KEY = 'cached_posts';

  const loadCachedPosts = () => {
    const cached = sessionStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch {
        return null;
      }
    }
    return null;
  };

  const savePosts = (data) => {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to cache posts:', e);
    }
  };

  const fetchPosts = async () => {
    try { 
      setLoading(true);
      setError(null);

      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data);
      savePosts(data);
    } catch (err) {
      const cachedPosts = loadCachedPosts();
      if (cachedPosts) {
        setPosts(cachedPosts);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cached = loadCachedPosts();
    if (cached) {
      setPosts(cached);
      setLoading(false);
    } else {
      fetchPosts();
    }
  }, []);

  const handleRefresh = () => {
    if (!isOnline) {
      alert('You are offline — cannot refresh. Showing cached data if available.');
      return;
    }
    fetchPosts();
  };

  const indexOfLastPost = page * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));

  const handleNextPage = () => {
    if (!isOnline) {
      alert('You are offline — pagination is disabled while offline.');
      return;
    }
    if (page < totalPages) setPage((p) => p + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevPage = () => {
    if (!isOnline) {
      alert('You are offline — pagination is disabled while offline.');
      return;
    }
    if (page > 1) setPage((p) => p - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading)
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box textAlign="center">
          <CircularProgress size={64} />
          <Typography sx={{ mt: 2, fontWeight: 600 }}>Loading posts...</Typography>
        </Box>
      </Box>
    );

  if (error)
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2 }}>
        <Paper sx={{ p: 4, borderRadius: 3, maxWidth: 520, textAlign: 'center' }}>
          <AlertCircle color="#B00020" size={36} />
          <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>Something went wrong</Typography>
          <Typography sx={{ mt: 1, color: 'text.secondary' }}>{error}</Typography>
          <Box sx={{ mt: 3 }}>
            <Button variant="contained" color="error" onClick={handleRefresh} startIcon={<RefreshCw />}>Try Again</Button>
          </Box>
        </Paper>
      </Box>
    );

  return (
    <AppContainer>
      <FacegramHeader onLogout={onLogout} user={user} />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <IconButton
              onClick={() => {
                if (!isOnline) {
                  alert('You are offline —.');
                  return;
                }
                onBack();
              }}
              disabled={!isOnline}
              sx={{ bgcolor: !isOnline ? 'transparent' : 'transparent' }}
            >
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" fontWeight={800}>Posts</Typography>
          </Box>

          <Button variant="contained" onClick={handleRefresh} startIcon={<RefreshCw />} disabled={!isOnline}>
          </Button>
        </Box>
      </Paper>

      {!isOnline && (
        <Paper sx={{ p: 1.5, mb: 2, bgcolor: 'warning.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AlertCircle />
            <Typography fontWeight={700}>You are offline.</Typography>
          </Box>
        </Paper>
      )}

      <Grid container spacing={2}>
        {currentPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card variant="outlined" sx={{ borderRadius: 3 }}>
              <CardContent sx={{ display: 'flex', gap: 2 }}>
                <Box
                    sx={{
                      width: 56,
                      height: 56,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #f58529, #dd2a7b, #833ab4, #5851db)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                      fontWeight: 700,
                      flexShrink: 0,
                      fontSize: '0.75rem',
                    }}
                    >
                      U{post.userId}
                    </Box>

                <Box>
                  <Typography variant="h6" fontWeight={800} sx={{ textTransform: 'capitalize' }}>{post.title}</Typography>
                  <Typography color="text.secondary">{post.body}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ p: 2, mt: 3, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <Button variant="contained" onClick={handlePrevPage} disabled={page === 1 || !isOnline}>Previous</Button>
          <Pagination count={totalPages} page={page} onChange={(e, val) => setPage(val)} color="primary" />
          <Button variant="contained" onClick={handleNextPage} disabled={page === totalPages || !isOnline}>Next</Button>
        </Box>
      </Paper>
    </AppContainer>
  );
}

function ProfileScreen({ user, setUser, onBack, onLogout, isOnline }) {
  const [editing, setEditing] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [city, setCity] = useState(user?.city || '');

  useEffect(() => {
    setFirstName(user?.firstName || '');
    setLastName(user?.lastName || '');
    setCity(user?.city || '');
  }, [user]);

  const saveProfile = () => {
    const updated = { ...user, firstName, lastName, city, displayName: `${firstName}${lastName ? ' ' + lastName : ''}`.trim() };
    setUser(updated);
    try {
      sessionStorage.setItem('user', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save user', e);
    }
    setEditing(false);
  };

  return (
    <AppContainer>
      <FacegramHeader onLogout={onLogout} user={user} />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton onClick={() => { if (!isOnline) { alert('You are offline — cannot navigate back while offline.'); return; } onBack(); }} disabled={!isOnline}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>Profile</Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Avatar sx={{ width: 112, height: 112, bgcolor: 'primary.main', mx: 'auto' }}>
            <User color="#fff" />
          </Avatar>
          <Typography variant="h4" fontWeight={800} sx={{ mt: 2 }}>{user?.displayName}</Typography>
          <Typography color="text.secondary">{user?.phone || ''}</Typography>
        </Box>

        {!editing ? (
          <Stack spacing={2}>
            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="overline">First name</Typography>
              <Typography>{user?.firstName || '-'}</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="overline">Last name</Typography>
              <Typography>{user?.lastName || '-'}</Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
              <Typography variant="overline">City</Typography>
              <Typography>{user?.city || '-'}</Typography>
            </Paper>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="contained" onClick={() => setEditing(true)}>Edit</Button>
              <Button fullWidth variant="outlined" onClick={onLogout}>Logout</Button>
            </Box>
          </Stack>
        ) : (
          <Stack spacing={2}>
            <TextField label="First name" value={firstName} onChange={(e) => setFirstName(e.target.value)} fullWidth />
            <TextField label="Last name" value={lastName} onChange={(e) => setLastName(e.target.value)} fullWidth />
            <TextField label="City" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button fullWidth variant="contained" onClick={saveProfile}>Save</Button>
              <Button fullWidth variant="outlined" onClick={() => setEditing(false)}>Cancel</Button>
            </Box>
          </Stack>
        )}
      </Paper>
    </AppContainer>
  );
}

function SettingsScreen({ user, onBack, onLogout, isOnline }) {
  return (
    <AppContainer>
      <FacegramHeader onLogout={onLogout} user={user} />

      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton onClick={() => { if (!isOnline) { alert('You are offline — cannot navigate back while offline.'); return; } onBack(); }} disabled={!isOnline}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h5" fontWeight={800}>Settings</Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" fontWeight={800}>Notifications</Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              <FormControlLabel control={<Switch defaultChecked />} label="Push Notifications" />
              <FormControlLabel control={<Switch defaultChecked />} label="Email Notifications" />
            </Stack>
          </Box>


          
        </Stack>
      </Paper>
    </AppContainer>
  );
}
