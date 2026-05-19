export function sweetConfirm({ title, text, confirmText = 'Lanjutkan', cancelText = 'Batal', danger = false }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-[9999] grid place-items-center bg-moss/35 px-5 backdrop-blur-sm'
    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-[1.75rem] bg-[#fffdf4] p-6 text-center shadow-[0_30px_80px_rgba(32,58,37,0.25)] ring-1 ring-moss/10">
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-full ${danger ? 'bg-red-50 text-red-700' : 'bg-[#edf5e4] text-leaf-700'}">
          <span class="text-2xl font-black">!</span>
        </div>
        <h2 class="mt-5 text-3xl font-black tracking-[-0.04em] text-leaf-900">${title}</h2>
        <p class="mt-3 text-sm font-semibold leading-6 text-moss/65">${text}</p>
        <div class="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button data-cancel class="rounded-full border border-moss/15 px-6 py-3 text-sm font-black text-moss">${cancelText}</button>
          <button data-confirm class="rounded-full ${danger ? 'bg-red-700 text-white hover:bg-red-800' : 'bg-leaf-600 text-white hover:bg-leaf-900'} px-6 py-3 text-sm font-black transition">${confirmText}</button>
        </div>
      </div>
    `

    const close = (result) => {
      overlay.remove()
      resolve(result)
    }

    overlay.querySelector('[data-confirm]').addEventListener('click', () => close(true))
    overlay.querySelector('[data-cancel]').addEventListener('click', () => close(false))
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close(false)
    })
    document.body.appendChild(overlay)
  })
}

export function sweetSuccess({ title = 'Berhasil', text = 'Data berhasil disimpan.', confirmText = 'OK' }) {
  return new Promise((resolve) => {
    const overlay = document.createElement('div')
    overlay.className = 'fixed inset-0 z-[9999] grid place-items-center bg-moss/25 px-5 backdrop-blur-sm'
    overlay.innerHTML = `
      <div class="w-full max-w-md rounded-[1.75rem] bg-[#fffdf4] p-6 text-center shadow-[0_30px_80px_rgba(32,58,37,0.25)] ring-1 ring-moss/10">
        <div class="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#edf5e4] text-leaf-700">
          <span class="text-xl font-black">OK</span>
        </div>
        <h2 class="mt-5 text-3xl font-black tracking-[-0.04em] text-leaf-900">${title}</h2>
        <p class="mt-3 text-sm font-semibold leading-6 text-moss/65">${text}</p>
        <div class="mt-6 flex justify-center">
          <button data-confirm class="rounded-full bg-leaf-600 px-6 py-3 text-sm font-black text-white transition hover:bg-leaf-900">${confirmText}</button>
        </div>
      </div>
    `

    const close = () => {
      overlay.remove()
      resolve(true)
    }

    overlay.querySelector('[data-confirm]').addEventListener('click', close)
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) close()
    })
    document.body.appendChild(overlay)
  })
}
