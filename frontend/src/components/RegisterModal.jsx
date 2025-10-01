import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import RegisterForm from './RegisterForm'

export default function RegisterModal ({ open, onClose, onSuccess, onOpenLogin }) {
  const handleOpenLogin = () => {
    if (onClose) {
      onClose()
    }
    if (onOpenLogin) {
      onOpenLogin()
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-ink-900/80 backdrop-blur" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-2xl transform overflow-hidden rounded-3xl border border-neutral-600/40 bg-surface-200/90 p-6 shadow-elevated backdrop-blur transition-all sm:p-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-neutral-400 transition hover:bg-surface-100/70 hover:text-neutral-100"
                  aria-label="Fechar modal"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    <Dialog.Title className="text-2xl font-semibold text-white">
                      Crie sua conta gratuita
                    </Dialog.Title>
                    <p className="text-sm text-neutral-400">
                      Cadastre-se para agendar serviços, gerenciar pets e acompanhar indicadores em tempo real.
                    </p>
                  </div>
                  <RegisterForm onSuccess={onSuccess} onOpenLogin={handleOpenLogin} />
                  <p className="text-center text-xs text-neutral-500">
                    Seus dados são protegidos e você pode falar com a Luma a qualquer momento para tirar dúvidas.
                  </p>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
