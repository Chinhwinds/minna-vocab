import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, LogOut, User as UserIcon } from 'lucide-react';

const AuthButton: React.FC = () => {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  if (loading) return null;
  return (
    <div className="inline-flex items-center gap-2">
      {user ? (
        <>
          <span className="text-xs text-muted inline-flex items-center gap-1">
            <UserIcon size={14} /> {user.displayName || user.email}
          </span>
          <button
            onClick={signOutUser}
            className="inline-flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-card text-text hover:bg-gray-50"
          >
            <LogOut size={16} /> Đăng xuất
          </button>
        </>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="inline-flex items-center gap-2 border border-border rounded-md px-3 py-2 bg-card text-text hover:bg-gray-50"
        >
          <LogIn size={16} /> Đăng nhập Google
        </button>
      )}
    </div>
  );
};

export default AuthButton;


