export const PREFIX_NO_USULAN = {
  1: 'RSN',
  2: 'RSS',
  3: 'RSW',
  4: 'PSU',
}

export const TIPE_USULAN = [
  {
    direktorat: 1,
    name: 'Bantuan Rumah Susun',
  },
  {
    direktorat: 2,
    name: 'Bantuan Rumah Khusus',
  },
  {
    direktorat: 3,
    name: 'Bantuan Stimulan Perumahan Swadaya',
  },
  {
    direktorat: 4,
    name: 'Bantuan Prasarana dan Sarana Umum',
  },
]

export const JENIS_DATA_USULAN = {
  ruk: [
    {
      value: 1,
      label: 'Non Skala Besar (Bantuan PSU NSB)',
    },
    {
      value: 2,
      label: 'Skala Besar (Bantuan PSU SB)',
    },
    {
      value: 3,
      label: 'Komunitas di Perumahan Umum',
    },
    {
      value: 4,
      label: 'Komunitas yang dibantu PBRS',
    },
    {
      value: 5,
      label: 'Perumahan Skala Besar Terdiri dari 1 (Satu) Perumahan',
      create: true,
    },
    {
      value: 6,
      label: 'Perumahan Selain Skala Besar',
      create: true,
    },
  ],
  non_ruk: [
    {
      value: 2,
      label: 'Penugasan Presiden',
      jenis: 'direktif',
      nilaiPrioritas: 7,
      keyPrioritas: 1,
    },
    {
      value: 3,
      label: 'Pimpinan dan Anggota Lembaga Tinggi Negara',
      jenis: 'direktif',
      nilaiPrioritas: 5,
      keyPrioritas: 2,
    },
    {
      value: 4,
      label: 'Pimpinan Kementerian/Lembaga',
      jenis: 'direktif',
      nilaiPrioritas: 4,
      keyPrioritas: 3,
    },
    {
      value: 5,
      label: 'Pimpinan PTN/PTS/PONPES/LPKB',
      jenis: '',
      nilaiPrioritas: 2,
      keyPrioritas: 4,
    },
    {
      value: 1,
      label: 'Kepala Daerah (Bupati/Walikota/Gubernur)',
      jenis: 'reguler',
      nilaiPrioritas: 3,
      keyPrioritas: 5,
    },
    {
      value: 6,
      label: 'Arahan Kebijakan Menteri',
      jenis: 'reguler',
      nilaiPrioritas: 6,
      keyPrioritas: 7,
    },
    {
      value: 7,
      label: 'Pengembangan Perumahan Umum',
      jenis: 'reguler',
      nilaiPrioritas: 1,
      keyPrioritas: 6,
    },
  ],
}

export const DIREKTORAT = {
  1: 'Direktorat Rumah Susun',
  2: 'Direktorat Rumah Khusus',
  3: 'Direktorat Rumah Swadaya',
  4: 'Direktorat Rumah Umum dan Komersil',
}

export const CHECKLIST_RANGKAIAN_PEMROGRAMAN = {
  1: 'RAKORBANGWIL',
  2: 'KONREG',
  3: 'RAKORTEK',
  4: 'RAKORTEKREMBANG',
  5: 'MUSREMBANGNAS',
  6: 'SB PAGU INDIKATIF',
  7: 'SB PAGU ANGGARAN',
  8: 'TRILATERAL MEETING I',
  9: 'RAKORTEK II',
  10: 'SB ALOKASI ANGGARAN',
  11: 'TRILATERAL MEETING II',
}
