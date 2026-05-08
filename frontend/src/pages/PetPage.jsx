import PlaceholderFeaturePage from '../components/PlaceholderFeaturePage.jsx'

function PetPage() {
  return (
    <PlaceholderFeaturePage
      eyebrow="Pet"
      title="Rawat Leafy dari satu tempat."
      description="Halaman pet akan memusatkan status Leafy, aksi makan, bermain, mandi, dan feedback mood. Dashboard tetap menampilkan ringkasan singkat."
      cards={[
        { label: 'Status', title: 'Health, happiness, cleanliness', description: 'Setiap status punya progress bar dan copywriting sederhana untuk tindakan berikutnya.' },
        { label: 'Aksi', title: 'Makan, main, mandi', description: 'Aksi pet memakai EcoPoints dan memberi feedback sukses atau poin tidak cukup.' },
        { label: 'Mood', title: 'Leafy lebih hidup', description: 'Animasi dan ekspresi Leafy tetap halus agar terasa hidup tanpa berlebihan.' },
      ]}
    />
  )
}

export default PetPage
