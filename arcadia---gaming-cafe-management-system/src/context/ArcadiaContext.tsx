import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Customer,
  GamingPC,
  MembershipPlan,
  CustomerMembership,
  GamingSession,
  Payment,
  CafeSettings,
  SqlQueryLog,
  PaymentMethod,
  RigStatus
} from '../types';
import {
  initialCustomers,
  initialPcs,
  initialPlans,
  initialMemberships,
  initialSessions,
  initialPayments,
  initialSettings,
  initialGames
} from '../data/initialData';
import { FeaturedGame } from '../types';

export type ActiveView = 
  | 'home'
  | 'games'
  | 'pcs'
  | 'memberships'
  | 'about'
  | 'contact'
  | 'dashboard'
  | 'customers'
  | 'sessions'
  | 'payments'
  | 'reports'
  | 'settings';

interface ArcadiaContextType {
  // State
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  games: FeaturedGame[];
  customers: Customer[];
  pcs: GamingPC[];
  sessions: GamingSession[];
  plans: MembershipPlan[];
  memberships: CustomerMembership[];
  payments: Payment[];
  settings: CafeSettings;
  sqlLogs: SqlQueryLog[];
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
  selectedReceiptId: number | null;
  setSelectedReceiptId: (id: number | null) => void;

  // Actions
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
  addGame: (gameData: Omit<FeaturedGame, 'id'>) => boolean;
  deleteGame: (gameId: string) => boolean;
  addCustomer: (data: { full_name: string; phone: string; email: string }) => boolean;
  updateCustomer: (id: number, data: { full_name: string; phone: string; email: string }) => boolean;
  deleteCustomer: (id: number) => boolean;

  addPC: (data: Omit<GamingPC, 'pc_id'>) => boolean;
  updatePC: (id: number, data: Partial<GamingPC>) => boolean;
  deletePC: (id: number) => boolean;
  togglePcStatus: (id: number, newStatus: RigStatus) => void;

  startSession: (customerId: number, pcId: number) => { success: boolean; message?: string; sessionId?: number };
  endSession: (sessionId: number, paymentMethod: PaymentMethod) => { success: boolean; message?: string; paymentId?: number; totalAmount?: number; durationMinutes?: number };

  createPlan: (data: Omit<MembershipPlan, 'plan_id'>) => boolean;
  assignMembership: (customerId: number, planId: number, paymentMethod: PaymentMethod) => boolean;

  updateSettings: (newSettings: Partial<CafeSettings>) => void;
  resetDatabaseToDefaults: () => void;
  clearSqlLogs: () => void;

  // Helpers
  getCustomerActiveMembership: (customerId: number) => { planName: string; discountPercentage: number; membership: CustomerMembership } | null;
  calculateCurrentCost: (session: GamingSession) => { elapsedMinutes: number; cost: number };
}

const ArcadiaContext = createContext<ArcadiaContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'arcadia_state_v1_';

export const ArcadiaProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [selectedReceiptId, setSelectedReceiptId] = useState<number | null>(null);

  // Load from localStorage or defaults
  const [games, setGames] = useState<FeaturedGame[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}games`);
    return saved ? JSON.parse(saved) : initialGames;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}customers`);
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [pcs, setPcs] = useState<GamingPC[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}pcs`);
    return saved ? JSON.parse(saved) : initialPcs;
  });

  const [sessions, setSessions] = useState<GamingSession[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}sessions`);
    return saved ? JSON.parse(saved) : initialSessions;
  });

  const [plans, setPlans] = useState<MembershipPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}plans`);
    return saved ? JSON.parse(saved) : initialPlans;
  });

  const [memberships, setMemberships] = useState<CustomerMembership[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}memberships`);
    return saved ? JSON.parse(saved) : initialMemberships;
  });

  const [payments, setPayments] = useState<Payment[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}payments`);
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [settings, setSettings] = useState<CafeSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY_PREFIX}settings`);
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [sqlLogs, setSqlLogs] = useState<SqlQueryLog[]>([]);
  const [, setTick] = useState(0);

  // Live timer tick every 10 seconds for real-time unbilled accrual
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}games`, JSON.stringify(games));
  }, [games]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}customers`, JSON.stringify(customers));
  }, [customers]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}pcs`, JSON.stringify(pcs));
  }, [pcs]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}sessions`, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}plans`, JSON.stringify(plans));
  }, [plans]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}memberships`, JSON.stringify(memberships));
  }, [memberships]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}payments`, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  const notify = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const logSql = (
    operation: SqlQueryLog['operation'],
    query: string,
    description: string,
    params?: any[],
    executionTimeMs = Math.floor(Math.random() * 3) + 1
  ) => {
    const entry: SqlQueryLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString(),
      operation,
      query,
      params,
      executionTimeMs,
      description
    };
    setSqlLogs(prev => [entry, ...prev.slice(0, 49)]); // keep recent 50 queries
  };

  const getCustomerActiveMembership = (customerId: number) => {
    const today = new Date().toISOString().slice(0, 10);
    const activeSub = memberships.find(
      m => m.customer_id === customerId && m.status === 'Active' && m.end_date >= today
    );
    if (!activeSub) return null;
    const plan = plans.find(p => p.plan_id === activeSub.plan_id);
    if (!plan) return null;
    return {
      planName: plan.plan_name,
      discountPercentage: plan.discount_percentage,
      membership: activeSub
    };
  };

  const calculateCurrentCost = (session: GamingSession) => {
    const startTime = new Date(session.start_time).getTime();
    const now = Date.now();
    const elapsedMinutes = Math.max(1, Math.round((now - startTime) / 60000));
    const cost = Number(((elapsedMinutes / 60) * session.applied_hourly_rate).toFixed(2));
    return { elapsedMinutes, cost };
  };

  // Games Management
  const addGame = (gameData: Omit<FeaturedGame, 'id'>) => {
    const slug = gameData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newId = games.some(g => g.id === slug) ? `${slug}-${Date.now()}` : slug;
    const newGame: FeaturedGame = {
      id: newId,
      ...gameData
    };
    setGames(prev => [newGame, ...prev]);
    notify(`Game "${gameData.title}" added to Arcadia library!`, 'success');
    return true;
  };

  const deleteGame = (gameId: string) => {
    setGames(prev => prev.filter(g => g.id !== gameId));
    notify('Game removed from library.', 'info');
    return true;
  };

  // Customer CRUD
  const addCustomer = (data: { full_name: string; phone: string; email: string }) => {
    if (customers.some(c => c.email.toLowerCase() === data.email.toLowerCase())) {
      notify('Duplicate Error: A customer with this email already exists.', 'error');
      return false;
    }
    if (customers.some(c => c.phone === data.phone)) {
      notify('Duplicate Error: A customer with this phone number already exists.', 'error');
      return false;
    }

    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.customer_id)) + 1 : 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newCustomer: Customer = {
      customer_id: newId,
      full_name: data.full_name,
      phone: data.phone,
      email: data.email,
      created_at: nowStr
    };

    setCustomers(prev => [newCustomer, ...prev]);
    logSql(
      'INSERT',
      `INSERT INTO customers (full_name, phone, email) VALUES (?, ?, ?);`,
      `Enrolled new customer "${data.full_name}"`,
      [data.full_name, data.phone, data.email]
    );
    notify(`Customer "${data.full_name}" registered successfully!`, 'success');
    return true;
  };

  const updateCustomer = (id: number, data: { full_name: string; phone: string; email: string }) => {
    setCustomers(prev =>
      prev.map(c => (c.customer_id === id ? { ...c, ...data } : c))
    );
    logSql(
      'UPDATE',
      `UPDATE customers SET full_name = ?, phone = ?, email = ? WHERE customer_id = ?;`,
      `Updated profile for Customer ID #${id}`,
      [data.full_name, data.phone, data.email, id]
    );
    notify('Customer record updated.', 'success');
    return true;
  };

  const deleteCustomer = (id: number) => {
    // Check if currently has an active gaming session
    const active = sessions.find(s => s.customer_id === id && s.status === 'Active');
    if (active) {
      notify(`Cannot remove customer profile while Rig session #${active.session_id} is active. Please end the session first.`, 'error');
      return false;
    }

    const customerToDelete = customers.find(c => c.customer_id === id);
    const customerName = customerToDelete ? customerToDelete.full_name : `#${id}`;

    // Cascade delete in line with relational schema (ON DELETE CASCADE)
    setCustomers(prev => prev.filter(c => c.customer_id !== id));
    setMemberships(prev => prev.filter(m => m.customer_id !== id));
    setSessions(prev => prev.filter(s => s.customer_id !== id));
    setPayments(prev => prev.filter(p => p.customer_id !== id));

    logSql(
      'DELETE',
      `DELETE FROM customers WHERE customer_id = ?; -- Cascades to customer_memberships, gaming_sessions, payments`,
      `Removed customer profile "${customerName}" (ID #${id})`,
      [id]
    );
    notify(`Customer "${customerName}" has been permanently deleted.`, 'success');
    return true;
  };

  // Gaming PC CRUD
  const addPC = (data: Omit<GamingPC, 'pc_id'>) => {
    if (pcs.some(p => p.pc_number.toUpperCase() === data.pc_number.toUpperCase())) {
      notify('A gaming station with this designation already exists.', 'error');
      return false;
    }
    const newId = pcs.length > 0 ? Math.max(...pcs.map(p => p.pc_id)) + 1 : 1;
    const newPC: GamingPC = {
      pc_id: newId,
      ...data
    };
    setPcs(prev => [...prev, newPC]);
    logSql(
      'INSERT',
      `INSERT INTO gaming_pcs (pc_number, specs, tier, hourly_rate, status, purchase_date) VALUES (?, ?, ?, ?, ?, ?);`,
      `Added gaming station "${data.pc_number}"`,
      [data.pc_number, data.specs, data.tier, data.hourly_rate, data.status, data.purchase_date]
    );
    notify(`Gaming station "${data.pc_number}" added to café.`, 'success');
    return true;
  };

  const updatePC = (id: number, data: Partial<GamingPC>) => {
    setPcs(prev => prev.map(p => (p.pc_id === id ? { ...p, ...data } : p)));
    logSql(
      'UPDATE',
      `UPDATE gaming_pcs SET specs = ?, hourly_rate = ?, status = ? WHERE pc_id = ?;`,
      `Updated configuration for station #${id}`,
      [data.specs, data.hourly_rate, data.status, id]
    );
    notify('Gaming station updated.', 'success');
    return true;
  };

  const deletePC = (id: number) => {
    const hasActive = sessions.find(s => s.pc_id === id && s.status === 'Active');
    if (hasActive) {
      notify('Cannot remove a gaming station while a session is in use.', 'error');
      return false;
    }
    setPcs(prev => prev.filter(p => p.pc_id !== id));
    logSql('DELETE', `DELETE FROM gaming_pcs WHERE pc_id = ?;`, `Removed PC ID #${id}`, [id]);
    notify('Gaming station removed.', 'info');
    return true;
  };

  const togglePcStatus = (id: number, newStatus: RigStatus) => {
    const pc = pcs.find(p => p.pc_id === id);
    if (!pc) return;
    if (pc.status === 'In Use' && newStatus !== 'In Use') {
      notify('Gaming station is currently occupied. Conclude session to release.', 'error');
      return;
    }
    setPcs(prev => prev.map(p => (p.pc_id === id ? { ...p, status: newStatus } : p)));
    logSql(
      'UPDATE',
      `UPDATE gaming_pcs SET status = ? WHERE pc_id = ?;`,
      `Status update for ${pc.pc_number} -> ${newStatus}`,
      [newStatus, id]
    );
    notify(`${pc.pc_number} is now ${newStatus}`, 'info');
  };

  // Start Session
  const startSession = (customerId: number, pcId: number) => {
    const pc = pcs.find(p => p.pc_id === pcId);
    const customer = customers.find(c => c.customer_id === customerId);

    if (!pc || !customer) {
      notify('Please select a valid customer and gaming station.', 'error');
      return { success: false, message: 'Invalid entity' };
    }

    // Trigger 2 Guard Check
    if (pc.status !== 'Available') {
      const msg = `Conflict: Rig "${pc.pc_number}" is ${pc.status}. Cannot assign new session.`;
      logSql(
        'TRIGGER',
        `-- TRIGGER trg_before_session_insert_guard FIRED:\n-- SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Conflict Error: Gaming PC is not available.'`,
        `Trigger prevented invalid session assignment on ${pc.pc_number}`
      );
      notify(msg, 'error');
      return { success: false, message: msg };
    }

    // Calculate applied rate with membership discount
    const membership = getCustomerActiveMembership(customerId);
    const discount = membership?.discountPercentage || 0;
    const effectiveRate = Number((pc.hourly_rate * (1 - discount / 100)).toFixed(2));

    const newSessionId = sessions.length > 0 ? Math.max(...sessions.map(s => s.session_id)) + 1 : 1;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newSession: GamingSession = {
      session_id: newSessionId,
      customer_id: customerId,
      pc_id: pcId,
      start_time: nowStr,
      end_time: null,
      duration_minutes: 0,
      applied_hourly_rate: effectiveRate,
      total_amount: 0.00,
      status: 'Active',
      created_at: nowStr
    };

    // Trigger 1: Auto flip PC to 'In Use'
    setPcs(prev => prev.map(p => (p.pc_id === pcId ? { ...p, status: 'In Use' } : p)));
    setSessions(prev => [newSession, ...prev]);

    logSql(
      'PROCEDURE',
      `CALL sp_start_gaming_session(${customerId}, ${pcId}, @new_session_id);\n-- Effective Rate: $${effectiveRate}/hr (Base: $${pc.hourly_rate}, Discount: ${discount}%)`,
      `Stored procedure executed for ${customer.full_name} on ${pc.pc_number}`,
      [customerId, pcId]
    );

    logSql(
      'TRIGGER',
      `-- TRIGGER trg_after_session_insert FIRED:\nUPDATE gaming_pcs SET status = 'In Use' WHERE pc_id = ${pcId};`,
      `Trigger automatically set ${pc.pc_number} status to 'In Use'`
    );

    notify(`Gaming session launched on ${pc.pc_number} for ${customer.full_name}!`, 'success');
    return { success: true, sessionId: newSessionId };
  };

  // Stored Procedure 2: End Session with ACID Transaction & Trigger 3
  const endSession = (sessionId: number, paymentMethod: PaymentMethod) => {
    const session = sessions.find(s => s.session_id === sessionId);
    if (!session || session.status !== 'Active') {
      notify('Session is not active or does not exist.', 'error');
      return { success: false, message: 'Invalid session state' };
    }

    const { elapsedMinutes, cost } = calculateCurrentCost(session);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newPaymentId = payments.length > 0 ? Math.max(...payments.map(p => p.payment_id)) + 1 : 1;

    // Simulate ACID Transaction:
    // 1. Update session to Completed
    // 2. Trigger releases PC to Available
    // 3. Insert into payments
    setSessions(prev =>
      prev.map(s =>
        s.session_id === sessionId
          ? {
              ...s,
              end_time: nowStr,
              duration_minutes: elapsedMinutes,
              total_amount: cost,
              status: 'Completed'
            }
          : s
      )
    );

    // Trigger 3: Release PC
    setPcs(prev => prev.map(p => (p.pc_id === session.pc_id ? { ...p, status: 'Available' } : p)));

    // Insert Payment
    const newPayment: Payment = {
      payment_id: newPaymentId,
      session_id: sessionId,
      customer_id: session.customer_id,
      amount: cost,
      payment_method: paymentMethod,
      payment_status: 'Completed',
      payment_time: nowStr
    };
    setPayments(prev => [newPayment, ...prev]);

    logSql(
      'TRANSACTION',
      `START TRANSACTION;\n` +
      `SELECT status, applied_hourly_rate FROM gaming_sessions WHERE session_id = ${sessionId} FOR UPDATE;\n` +
      `UPDATE gaming_sessions SET end_time = NOW(), duration_minutes = ${elapsedMinutes}, total_amount = ${cost.toFixed(2)}, status = 'Completed' WHERE session_id = ${sessionId};\n` +
      `INSERT INTO payments (session_id, customer_id, amount, payment_method, payment_status, payment_time) VALUES (${sessionId}, ${session.customer_id}, ${cost.toFixed(2)}, '${paymentMethod}', 'Completed', NOW());\n` +
      `COMMIT;`,
      `Atomic transaction settled session #${sessionId} for $${cost.toFixed(2)} via ${paymentMethod}`
    );

    logSql(
      'TRIGGER',
      `-- TRIGGER trg_after_session_update_release FIRED:\nUPDATE gaming_pcs SET status = 'Available' WHERE pc_id = ${session.pc_id};`,
      `Trigger restored PC #${session.pc_id} back to 'Available'`
    );

    notify(`Session settled: ${elapsedMinutes} mins played, $${cost.toFixed(2)} charged.`, 'success');
    setSelectedReceiptId(newPaymentId);
    return {
      success: true,
      paymentId: newPaymentId,
      totalAmount: cost,
      durationMinutes: elapsedMinutes
    };
  };

  // Membership Management
  const createPlan = (data: Omit<MembershipPlan, 'plan_id'>) => {
    const newId = plans.length > 0 ? Math.max(...plans.map(p => p.plan_id)) + 1 : 1;
    const newPlan: MembershipPlan = { plan_id: newId, ...data };
    setPlans(prev => [...prev, newPlan]);
    logSql(
      'INSERT',
      `INSERT INTO membership_plans (plan_name, price, validity_days, discount_percentage, benefits) VALUES (?, ?, ?, ?, ?);`,
      `Created tier plan "${data.plan_name}"`,
      [data.plan_name, data.price, data.validity_days, data.discount_percentage, data.benefits]
    );
    notify(`Membership Plan "${data.plan_name}" created!`, 'success');
    return true;
  };

  const assignMembership = (customerId: number, planId: number, paymentMethod: PaymentMethod) => {
    const customer = customers.find(c => c.customer_id === customerId);
    const plan = plans.find(p => p.plan_id === planId);
    if (!customer || !plan) {
      notify('Invalid customer or plan.', 'error');
      return false;
    }

    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + plan.validity_days);

    const startStr = today.toISOString().slice(0, 10);
    const endStr = expiry.toISOString().slice(0, 10);
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const newSubId = memberships.length > 0 ? Math.max(...memberships.map(m => m.membership_id)) + 1 : 1;
    const newPaymentId = payments.length > 0 ? Math.max(...payments.map(p => p.payment_id)) + 1 : 1;

    const newSub: CustomerMembership = {
      membership_id: newSubId,
      customer_id: customerId,
      plan_id: planId,
      start_date: startStr,
      end_date: endStr,
      status: 'Active',
      created_at: nowStr
    };

    const newPayment: Payment = {
      payment_id: newPaymentId,
      session_id: null,
      customer_id: customerId,
      amount: plan.price,
      payment_method: paymentMethod,
      payment_status: 'Completed',
      payment_time: nowStr
    };

    setMemberships(prev => [newSub, ...prev]);
    setPayments(prev => [newPayment, ...prev]);

    logSql(
      'TRANSACTION',
      `START TRANSACTION;\n` +
      `INSERT INTO customer_memberships (customer_id, plan_id, start_date, end_date, status) VALUES (${customerId}, ${planId}, '${startStr}', '${endStr}', 'Active');\n` +
      `INSERT INTO payments (customer_id, amount, payment_method, payment_status, payment_time) VALUES (${customerId}, ${plan.price}, '${paymentMethod}', 'Completed', NOW());\n` +
      `COMMIT;`,
      `Assigned "${plan.plan_name}" to ${customer.full_name} and recorded $${plan.price} receipt`
    );

    notify(`Assigned ${plan.plan_name} to ${customer.full_name}!`, 'success');
    return true;
  };

  const updateSettings = (newSettings: Partial<CafeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
    logSql(
      'UPDATE',
      `UPDATE cafe_settings SET cafe_name = ?, default_hourly_rate = ?, contact_email = ? WHERE setting_id = 1;`,
      'Updated cafe configuration parameters'
    );
    notify('Cafe settings saved.', 'success');
  };

  const resetDatabaseToDefaults = () => {
    setGames(initialGames);
    setCustomers(initialCustomers);
    setPcs(initialPcs);
    setSessions(initialSessions);
    setPlans(initialPlans);
    setMemberships(initialMemberships);
    setPayments(initialPayments);
    setSettings(initialSettings);
    setSqlLogs([]);
    localStorage.clear();
    notify('Café database restored to default state.', 'info');
  };

  const clearSqlLogs = () => {
    setSqlLogs([]);
  };

  return (
    <ArcadiaContext.Provider
      value={{
        activeView,
        setActiveView,
        games,
        customers,
        pcs,
        sessions,
        plans,
        memberships,
        payments,
        settings,
        sqlLogs,
        notification,
        selectedReceiptId,
        setSelectedReceiptId,
        notify,
        addGame,
        deleteGame,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addPC,
        updatePC,
        deletePC,
        togglePcStatus,
        startSession,
        endSession,
        createPlan,
        assignMembership,
        updateSettings,
        resetDatabaseToDefaults,
        clearSqlLogs,
        getCustomerActiveMembership,
        calculateCurrentCost
      }}
    >
      {children}
    </ArcadiaContext.Provider>
  );
};

export const useArcadia = () => {
  const context = useContext(ArcadiaContext);
  if (!context) throw new Error('useArcadia must be used within an ArcadiaProvider');
  return context;
};
