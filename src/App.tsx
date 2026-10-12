/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/landing/LandingPage';
import { ConsultationMarketplace } from './components/marketplace/ConsultationMarketplace';
import { ConsultationRoom } from './components/room/ConsultationRoom';
import { SessionSummaryModal } from './components/room/SessionSummaryModal';
import { UserDashboard } from './components/dashboard/UserDashboard';
import { BillingView } from './components/billing/BillingView';
import { OrdersHistory } from './components/orders/OrdersHistory';
import { AccountSettings } from './components/account/AccountSettings';
import { AdminOperationsView } from './components/admin/AdminOperationsView';
import { AuthModal } from './components/auth/AuthModal';
import { RechargeModal } from './components/modals/RechargeModal';
import { dbService } from './lib/supabase/client';
import { ConsultationOffering, ConsultationSession, OrderRecord, UserProfile } from './types';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [user, setUser] = useState<UserProfile>(dbService.getProfile());
  const [offerings, setOfferings] = useState<ConsultationOffering[]>(dbService.getOfferings());
  const [orders, setOrders] = useState<OrderRecord[]>(dbService.getOrders());
  const [ledger, setLedger] = useState(dbService.getLedger());

  // Room & Session State
  const [activeRoomOffering, setActiveRoomOffering] = useState<ConsultationOffering | null>(null);
  const [completedSession, setCompletedSession] = useState<ConsultationSession | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderRecord | null>(null);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [rechargeModalOpen, setRechargeModalOpen] = useState(false);

  // Sync state helpers
  const handleUpdateUser = (updates: Partial<UserProfile>) => {
    const updated = dbService.updateProfile(updates);
    setUser(updated);
  };

  const handleStartSession = (offering: ConsultationOffering) => {
    setActiveRoomOffering(offering);
    setCurrentTab('room');
  };

  const handleEndSession = (session: ConsultationSession) => {
    const { order, ledgerEntry } = dbService.recordCompletedSession(session);
    setUser(dbService.getProfile());
    setOrders(dbService.getOrders());
    setLedger(dbService.getLedger());
    setActiveRoomOffering(null);
    setCompletedSession(session);
    setCompletedOrder(order);
    setCurrentTab('dashboard');
  };

  const handleRechargeSuccess = (amount: number, description: string) => {
    const { user: updatedUser } = dbService.rechargeBalance(amount, description);
    setUser(updatedUser);
    setLedger(dbService.getLedger());
  };

  const handleUpdateAutoRecharge = (enabled: boolean, threshold: number, amount: number) => {
    handleUpdateUser({
      autoRechargeEnabled: enabled,
      autoRechargeThresholdUsd: threshold,
      autoRechargeAmountUsd: amount,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Bar Navigation */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        user={user}
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenRecharge={() => setRechargeModalOpen(true)}
        isRoomActive={activeRoomOffering !== null && currentTab !== 'room'}
        onReturnToRoom={() => setCurrentTab('room')}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentTab === 'landing' && (
          <LandingPage
            offerings={offerings}
            onSelectOffering={(off) => handleStartSession(off)}
            onExplore={() => setCurrentTab('marketplace')}
            onStartInstantSession={() => handleStartSession(offerings[0])}
          />
        )}

        {currentTab === 'marketplace' && (
          <ConsultationMarketplace
            offerings={offerings}
            onStartSession={(off) => handleStartSession(off)}
            userBalance={user.balanceUsd}
            onOpenRecharge={() => setRechargeModalOpen(true)}
          />
        )}

        {currentTab === 'dashboard' && (
          <UserDashboard
            user={user}
            offerings={offerings}
            orders={orders}
            ledger={ledger}
            onStartSession={(off) => handleStartSession(off)}
            onOpenRecharge={() => setRechargeModalOpen(true)}
            onViewOrders={() => setCurrentTab('orders')}
            onViewBilling={() => setCurrentTab('billing')}
          />
        )}

        {currentTab === 'room' && activeRoomOffering && (
          <ConsultationRoom
            offering={activeRoomOffering}
            onEndSession={handleEndSession}
            userBalance={user.balanceUsd}
          />
        )}

        {currentTab === 'billing' && (
          <BillingView
            user={user}
            ledger={ledger}
            onOpenRecharge={() => setRechargeModalOpen(true)}
            onUpdateAutoRecharge={handleUpdateAutoRecharge}
          />
        )}

        {currentTab === 'orders' && <OrdersHistory orders={orders} />}

        {currentTab === 'account' && (
          <AccountSettings
            user={user}
            onUpdateUser={handleUpdateUser}
            onSignOut={() => setAuthModalOpen(true)}
          />
        )}

        {currentTab === 'operations' && <AdminOperationsView />}
      </main>

      {/* Footer */}
      {currentTab !== 'room' && <Footer onSelectTab={(tab) => setCurrentTab(tab)} />}

      {/* Session Completed Summary & Receipt Modal */}
      {completedSession && completedOrder && (
        <SessionSummaryModal
          session={completedSession}
          order={completedOrder}
          remainingBalance={user.balanceUsd}
          onClose={() => {
            setCompletedSession(null);
            setCompletedOrder(null);
          }}
          onGoToOrders={() => {
            setCompletedSession(null);
            setCompletedOrder(null);
            setCurrentTab('orders');
          }}
        />
      )}

      {/* Auth Modal */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLogin={(userData) => {
            handleUpdateUser(userData);
          }}
        />
      )}

      {/* Recharge Modal */}
      {rechargeModalOpen && (
        <RechargeModal
          onClose={() => setRechargeModalOpen(false)}
          onSuccess={handleRechargeSuccess}
          currentBalance={user.balanceUsd}
        />
      )}
    </div>
  );
}
