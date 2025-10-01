import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import LoginForm from './LoginForm'

export default function LoginModal ({ open, onClose, onSuccess }) {
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
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
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
              <Dialog.Panel className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 shadow-2xl transition-all sm:p-8">
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                  aria-label="Fechar modal"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
                <div className="space-y-6">
                  <div className="space-y-2 text-center">
                    <Dialog.Title className="text-2xl font-semibold text-slate-900">
                      Entre para acessar sua agenda
                    </Dialog.Title>
                    <p className="text-sm text-slate-500">
                      Faça login para confirmar horários, gerenciar clientes e acompanhar o histórico dos pets.
                    </p>
                  </div>
                  <LoginForm onSuccess={onSuccess} />
                  <p className="text-center text-xs text-slate-400">
                    Dica: você também pode agendar conversando com a Luma diretamente pelo chat na página.
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
