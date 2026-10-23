const $=s=>document.querySelector(s),esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const dt=n=>{const d=new Date();d.setDate(d.getDate()+n);return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0")};
const TODAY=dt(0),KEY="simsarpras.v1",fmt=n=>n.toLocaleString("en-US"),sum=(a,f)=>a.reduce((s,x)=>s+f(x),0);
const MENU=[["dashboard","dashboard","Dashboard"],["barang","inventory_2","Data Barang & Aset"],["peminjaman","calendar_month","Peminjaman Sarpras"],["pemeliharaan","build","Pemeliharaan"],["lokasi","meeting_room","Lokasi & Ruangan"],["laporan","analytics","Laporan & Analitik"],["pengaturan","settings","Pengaturan Sistem"]];
const KAT=["Furnitur","Elektronik","Jaringan","Perlengkapan Kelas","Utilitas"],KOND=["Baik","Rusak Ringan","Rusak Berat"];
const COL={Baik:"bg-emerald-50 text-emerald-700","Rusak Ringan":"bg-amber-50 text-amber-700","Rusak Berat":"bg-rose-50 text-rose-700",Menunggu:"bg-amber-50 text-amber-700",Dipinjam:"bg-blue-50 text-blue-700",Terlambat:"bg-rose-50 text-rose-700",Dikembalikan:"bg-emerald-50 text-emerald-700",Ditolak:"bg-slate-100 text-slate-600",Dilaporkan:"bg-amber-50 text-amber-700",Dikerjakan:"bg-blue-50 text-blue-700",Selesai:"bg-emerald-50 text-emerald-700",Darurat:"bg-rose-50 text-rose-700",Normal:"bg-slate-100 text-slate-600"};
const MON=[["Jan",45],["Feb",52],["Mar",68],["Apr",38],["Mei",75],["Jun",82],["Jul",30],["Agu",88],["Sep",95],["Okt",84]];

function seed(){
  const A=(i,n,k,l,j,c)=>({id:"a"+i,kode:"INV-"+String(i).padStart(3,"0"),nama:n,kat:k,lokasi:l,jumlah:j,kondisi:c});
  return{seq:100,
    assets:[A(1,"Kursi Kuliah","Furnitur","Gedung A R.101",500,"Baik"),A(2,"Meja Kuliah","Furnitur","Gedung A R.102",300,"Baik"),A(3,"PC Lab Komputer","Elektronik","Lab Komputer 1",150,"Baik"),A(4,"Proyektor EPSON X400","Elektronik","Gedung B R.201",45,"Baik"),A(5,"AC Split 1.5 PK","Utilitas","Gedung B R.204",60,"Rusak Ringan"),A(6,"Switch Cisco 24 Port","Jaringan","Ruang Server",35,"Baik"),A(7,"Papan Tulis Whiteboard","Perlengkapan Kelas","Gedung A R.103",90,"Baik"),A(8,"Mikrofon Wireless","Elektronik","Aula",50,"Baik"),A(9,"Access Point WiFi","Jaringan","Gedung A R.103",160,"Baik"),A(10,"Printer Laser","Elektronik","Ruang Administrasi",30,"Rusak Berat")],
    loans:[{id:"l1",aset:"Proyektor EPSON X400",jml:2,peminjam:"BEM FTI",mulai:dt(0),selesai:dt(2),perlu:"Rapat kerja",status:"Menunggu"},{id:"l2",aset:"Mikrofon Wireless",jml:4,peminjam:"HIMA TI",mulai:dt(-2),selesai:dt(1),perlu:"Seminar",status:"Dipinjam"},{id:"l3",aset:"Proyektor EPSON X400",jml:1,peminjam:"Bu Rina (Dosen)",mulai:dt(-5),selesai:dt(-1),perlu:"Perkuliahan",status:"Dipinjam"},{id:"l4",aset:"Kursi Kuliah",jml:20,peminjam:"UKM Fotografi",mulai:dt(-10),selesai:dt(-8),perlu:"Pameran",status:"Dikembalikan"}],
    maint:[{id:"m1",aset:"AC Split 1.5 PK",lokasi:"Gedung B R.204",masalah:"AC R.204 bocor freon",prioritas:"Darurat",status:"Dilaporkan",tgl:dt(0)},{id:"m2",aset:"Printer Laser",lokasi:"Ruang Administrasi",masalah:"Roller kertas macet",prioritas:"Normal",status:"Dikerjakan",tgl:dt(-3)},{id:"m3",aset:"Proyektor EPSON X400",lokasi:"Gedung B R.201",masalah:"Lampu redup",prioritas:"Darurat",status:"Dikerjakan",tgl:dt(-1)},{id:"m4",aset:"Switch Cisco 24 Port",lokasi:"Ruang Server",masalah:"Servis berkala triwulan",prioritas:"Normal",status:"Selesai",tgl:dt(-12)}],
    rooms:[["Gedung A R.101","Gedung A",1,40],["Gedung A R.102","Gedung A",1,40],["Gedung A R.103","Gedung A",1,35],["Gedung B R.201","Gedung B",2,50],["Gedung B R.204","Gedung B",2,45],["Lab Komputer 1","Gedung C",1,40],["Ruang Server","Gedung C",1,5],["Aula","Gedung Utama",1,300],["Ruang Administrasi","Gedung Utama",2,20]].map((r,i)=>({id:"r"+i,nama:r[0],gedung:r[1],lantai:r[2],kap:r[3]})),
    user:{nama:"Siti Rahma, M.T.",jabatan:"Kepala Bag. Sarpras",instansi:"Universitas Pamulang",prodi:"Teknik Informatika"}};
}
function load(){try{const r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){}return seed()}
function save(){try{localStorage.setItem(KEY,JSON.stringify(D))}catch(e){}}
let D=load(),tab="dashboard",Q="",F={kat:"",kond:""},LS="";

const used=n=>sum(D.loans.filter(l=>l.aset===n&&l.status==="Dipinjam"),l=>l.jml),avail=a=>a.jumlah-used(a.nama);
const st=l=>l.status==="Dipinjam"&&l.selesai<TODAY?"Terlambat":l.status;
const hit=(...v)=>!Q||v.join(" ").toLowerCase().includes(Q);
const tag=t=>`<span class="px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap ${COL[t]||""}">${esc(t)}</span>`;
const ico=(n,c="")=>`<span class="material-symbols-outlined text-lg ${c}">${n}</span>`;
const head=(t,s,b="")=>`<div class="card p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h2 class="text-xl font-bold text-slate-900">${t}</h2><p class="text-xs text-slate-500 mt-1">${s}</p></div><div class="flex gap-2 flex-wrap">${b}</div></div>`;
const tbl=(h,rows)=>`<div class="overflow-x-auto"><table class="w-full text-xs text-left"><thead class="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider"><tr>${h.map(x=>`<th class="px-4 py-3 font-bold">${x}</th>`).join("")}</tr></thead><tbody class="divide-y divide-slate-100">${rows.join("")||`<tr><td colspan="${h.length}" class="p-8 text-center text-slate-400">Data tidak ditemukan</td></tr>`}</tbody></table></div>`;
const td=(...c)=>`<tr class="hover:bg-slate-50/70">${c.map(x=>`<td class="px-4 py-3">${x}</td>`).join("")}</tr>`;
const sel=(k,ph,o)=>`<select class="inp !w-auto" onchange="F.${k}=this.value;render()"><option value="">${ph}</option>${o.map(x=>`<option ${F[k]===x?"selected":""}>${x}</option>`).join("")}</select>`;

const VIEWS={
dashboard(){
  const T=sum(D.assets,a=>a.jumlah),by=k=>sum(D.assets.filter(a=>a.kondisi===k),a=>a.jumlah),b=by("Baik"),r=by("Rusak Ringan"),h=by("Rusak Berat"),p=x=>T?x/T*100:0;
  const out=sum(D.loans.filter(l=>l.status==="Dipinjam"),l=>l.jml),act=D.loans.filter(l=>["Menunggu","Dipinjam"].includes(l.status)).length,late=D.loans.filter(l=>st(l)==="Terlambat").length;
  const mt=D.maint.filter(x=>x.status!=="Selesai"),em=mt.filter(x=>x.prioritas==="Darurat").length;
  const kpi=(l,v,c,i,sub,g)=>`<div class="card p-5 relative overflow-hidden hover:shadow-md transition ${g?"cursor-pointer":""}" ${g?`onclick="go('${g}')"`:""}><div class="flex items-center justify-between"><div><p class="text-[11px] font-bold uppercase tracking-wider text-slate-400">${l}</p><h3 class="text-2xl font-extrabold text-slate-900 mt-1">${v}</h3></div><div class="p-3 rounded-xl bg-${c}-50 text-${c}-600"><span class="material-symbols-outlined text-2xl">${i}</span></div></div><div class="mt-4 text-xs text-slate-500">${sub}</div><div class="absolute bottom-0 inset-x-0 h-1 bg-${c}-500"></div></div>`;
  const path='d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" stroke-width="3.8" fill="none" stroke="currentColor"';
  const leg=(c,l,v)=>`<div class="flex items-center justify-between text-xs"><div class="flex items-center gap-2"><span class="w-3 h-3 rounded-full bg-${c}-500"></span><span class="text-slate-600 font-medium">${l}</span></div><span class="font-bold">${fmt(v)} Unit (${p(v).toFixed(1)}%)</span></div>`;
  return`<div class="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"><div><h2 class="text-xl sm:text-2xl font-bold text-slate-900">Selamat Datang di SIM-SARPRAS 👋</h2><p class="text-xs sm:text-sm text-slate-500 mt-1">Ringkasan status inventaris, jadwal peminjaman aktif, dan pemeliharaan fasilitas kampus.</p></div><div class="flex gap-2 flex-wrap"><button onclick="borrowForm()" class="btn bs">${ico("edit_calendar")}Ajukan Pinjaman</button><button onclick="assetForm()" class="btn bp">${ico("add_circle")}Input Aset Baru</button></div></div>
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
${kpi("Total Inventaris",fmt(T)+' <span class="text-xs font-medium text-slate-500">Unit</span>',"blue","inventory_2",D.assets.length+" jenis aset • "+KAT.length+" kategori","barang")}
${kpi("Sedang Dipinjam",out+' <span class="text-xs font-medium text-slate-500">Unit</span>',"teal","output",`<b class="text-teal-600">${act} Permohonan Aktif</b> • ${late} Terlambat`,"peminjaman")}
${kpi("Dalam Pemeliharaan",mt.length+' <span class="text-xs font-medium text-slate-500">Tiket</span>',"amber","engineering",`<b class="text-amber-600">${em} Darurat</b> membutuhkan perbaikan`,"pemeliharaan")}
${kpi("Kondisi Layak Pakai",p(b).toFixed(1)+"%","emerald","verified_user",`<b class="text-emerald-600">${fmt(b)} Unit Siap</b>`,"laporan")}
</div>
<div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
<div class="lg:col-span-5 card p-6 flex flex-col justify-between"><div><h3 class="font-bold text-sm">Kondisi Fisik Seluruh Aset</h3><p class="text-xs text-slate-400">Persentase kelayakan sarana prasarana</p>
<div class="flex items-center justify-center my-6 relative"><svg class="w-48 h-48 -rotate-90" viewBox="0 0 36 36"><path class="text-slate-100" ${path}/><path class="text-emerald-500" stroke-dasharray="${p(b)},100" ${path}/><path class="text-amber-500" stroke-dasharray="${p(r)},100" stroke-dashoffset="${-p(b)}" ${path}/><path class="text-rose-500" stroke-dasharray="${p(h)},100" stroke-dashoffset="${-(p(b)+p(r))}" ${path}/></svg><div class="absolute text-center"><span class="block text-2xl font-extrabold">${fmt(T)}</span><span class="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Aset</span></div></div></div>
<div class="space-y-2.5 pt-4 border-t border-slate-100">${leg("emerald","Baik / Sangat Layak",b)}${leg("amber","Rusak Ringan (Servis)",r)}${leg("rose","Rusak Berat / Rekomendasi Afkir",h)}</div></div>
<div class="lg:col-span-7 card p-6 flex flex-col justify-between"><div><h3 class="font-bold text-sm">Tren Peminjaman Aset Bulanan (${new Date().getFullYear()})</h3><p class="text-xs text-slate-400">Frekuensi pengajuan peminjaman sarana & ruangan</p>
<div class="h-56 flex items-end justify-between gap-2 pt-8 pb-2 px-2">${MON.map(([m,v],i)=>`<div class="flex-1 flex flex-col items-center gap-2 h-full justify-end group"><div class="w-full ${i==9?"bg-blue-600":"bg-blue-100 group-hover:bg-blue-500"} rounded-t-lg transition relative" style="height:${v}%"><span class="${i==9?"":"opacity-0 group-hover:opacity-100"} absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-0.5 px-1.5 rounded font-bold">${v}</span></div><span class="text-[11px] ${i==9?"font-bold text-blue-600":"text-slate-400"}">${m}</span></div>`).join("")}</div></div>
<div class="pt-4 border-t border-slate-100 flex justify-end"><button onclick="go('laporan')" class="text-blue-600 text-xs font-bold hover:underline flex items-center">Detail Laporan ${ico("chevron_right","!text-sm")}</button></div></div></div>`;
},
barang(){
  const rows=D.assets.filter(a=>hit(a.kode,a.nama,a.kat,a.lokasi)&&(!F.kat||a.kat===F.kat)&&(!F.kond||a.kondisi===F.kond));
  return head("Daftar Inventaris Sarana & Prasarana","Kelola data seluruh aset, kode inventaris, status kelayakan, dan lokasinya.",`<button class="btn bp" onclick="assetForm()">${ico("add","!text-base")}Tambah Aset Baru</button>`)+
  `<div class="card"><div class="p-4 flex flex-wrap gap-2 border-b border-slate-100">${sel("kat","Semua Kategori",KAT)}${sel("kond","Semua Kondisi",KOND)}<span class="ml-auto text-xs text-slate-400 self-center">${rows.length} aset</span></div>`+
  tbl(["Kode","Nama Aset","Kategori","Lokasi","Tersedia","Kondisi","Aksi"],rows.map(a=>td(esc(a.kode),`<b>${esc(a.nama)}</b>`,esc(a.kat),esc(a.lokasi),`${avail(a)} / ${a.jumlah}`,tag(a.kondisi),`<div class="flex"><button class="ib" title="Pinjam" onclick="borrowForm('${a.id}')">${ico("event_available")}</button><button class="ib" title="Lapor kerusakan" onclick="maintForm('${a.id}')">${ico("build")}</button><button class="ib" title="Edit" onclick="assetForm('${a.id}')">${ico("edit")}</button><button class="ib" title="Hapus" onclick="delAsset('${a.id}')">${ico("delete")}</button></div>`)))+`</div>`;
},
peminjaman(){
  const rows=D.loans.filter(l=>hit(l.aset,l.peminjam,l.perlu)&&(!LS||st(l)===LS));
  const act=l=>{const s=st(l);return s==="Menunggu"?`<button class="ib" title="Setujui" onclick="loanSet('${l.id}','Dipinjam')">${ico("check_circle","text-emerald-600")}</button><button class="ib" title="Tolak" onclick="loanSet('${l.id}','Ditolak')">${ico("cancel","text-rose-500")}</button>`:s==="Dipinjam"||s==="Terlambat"?`<button class="btn bo !py-1" onclick="loanSet('${l.id}','Dikembalikan')">Kembalikan</button>`:""};
  return head("Manajemen Peminjaman Sarpras","Kelola pengajuan, persetujuan, dan pengembalian sarana prasarana kampus.",`<button class="btn bs" onclick="borrowForm()">${ico("event_available","!text-base")}Pinjam Sarpras</button>`)+
  `<div class="card"><div class="p-4 flex flex-wrap gap-2 border-b border-slate-100">${["Semua","Menunggu","Dipinjam","Terlambat","Dikembalikan","Ditolak"].map(s=>`<button class="chip ${(LS||"Semua")===s?"on":""}" onclick="LS='${s==="Semua"?"":s}';render()">${s}</button>`).join("")}</div>`+
  tbl(["Aset","Jml","Peminjam","Periode","Keperluan","Status","Aksi"],rows.map(l=>td(`<b>${esc(l.aset)}</b>`,l.jml,esc(l.peminjam),`${l.mulai} → ${l.selesai}`,esc(l.perlu),tag(st(l)),act(l))))+`</div>`;
},
pemeliharaan(){
  const rows=[...D.maint].filter(m=>hit(m.aset,m.lokasi,m.masalah)).sort((a,b)=>(a.status==="Selesai")-(b.status==="Selesai")||(b.prioritas==="Darurat")-(a.prioritas==="Darurat"));
  const nx={Dilaporkan:["Dikerjakan","Mulai Kerjakan"],Dikerjakan:["Selesai","Selesaikan"]};
  const c=s=>D.maint.filter(m=>m.status===s).length;
  return head("Pemeliharaan & Perbaikan","Daftar aset dalam proses perbaikan atau servis berkala.",`<button class="btn bp" onclick="maintForm()">${ico("report","!text-base")}Lapor Kerusakan</button>`)+
  `<div class="grid grid-cols-3 gap-4">${["Dilaporkan","Dikerjakan","Selesai"].map(s=>`<div class="card p-4 text-center"><div class="text-2xl font-extrabold">${c(s)}</div><div class="mt-1">${tag(s)}</div></div>`).join("")}</div><div class="card">`+
  tbl(["Aset","Lokasi","Masalah","Prioritas","Status","Tanggal","Aksi"],rows.map(m=>td(`<b>${esc(m.aset)}</b>`,esc(m.lokasi),esc(m.masalah),tag(m.prioritas),tag(m.status),m.tgl,`<div class="flex items-center">${nx[m.status]?`<button class="btn bo !py-1" onclick="maintNext('${m.id}')">${nx[m.status][1]}</button>`:""}<button class="ib" title="Hapus" onclick="delMaint('${m.id}')">${ico("delete")}</button></div>`)))+`</div>`;
},
lokasi(){
  const rows=D.rooms.filter(r=>hit(r.nama,r.gedung));
  return head("Lokasi & Ruangan","Daftar gedung, lantai, dan ruangan inventaris kampus.",`<button class="btn bp" onclick="roomForm()">${ico("add","!text-base")}Tambah Ruangan</button>`)+
  `<div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">${rows.map(r=>{const as=D.assets.filter(a=>a.lokasi===r.nama);return`<div class="card p-5"><div class="flex justify-between items-start"><div><h3 class="font-bold text-sm">${esc(r.nama)}</h3><p class="text-xs text-slate-500">${esc(r.gedung)} • Lantai ${r.lantai} • Kapasitas ${r.kap}</p></div><button class="ib" title="Hapus ruangan" onclick="delRoom('${r.id}')">${ico("delete")}</button></div><div class="mt-3 text-xs text-slate-600"><b>${fmt(sum(as,a=>a.jumlah))}</b> unit aset • ${as.length} jenis</div><button class="text-blue-600 text-xs font-bold mt-2 hover:underline" onclick="Q='${esc(r.nama).replace(/'/g,"")}'.toLowerCase();$('#gs').value=Q;go('barang')">Lihat aset</button></div>`}).join("")||'<p class="text-sm text-slate-400">Ruangan tidak ditemukan.</p>'}</div>`;
},
laporan(){
  const T=sum(D.assets,a=>a.jumlah),n=(k,c)=>sum(D.assets.filter(a=>a.kat===k&&a.kondisi===c),a=>a.jumlah);
  return head("Laporan & Analitik","Cetak rekapitulasi aset dan grafik statistik penggunaan.",`<button class="btn bo" onclick="exportCSV()">${ico("download","!text-base")}Ekspor CSV</button><button class="btn bp" onclick="window.print()">${ico("print","!text-base")}Cetak</button>`)+
  `<div id="printableArea" class="card p-6 space-y-5"><div><h3 class="font-bold text-lg">Rekapitulasi Aset ${esc(D.user.instansi)}</h3><p class="text-xs text-slate-500">${esc(D.user.prodi)} • Dicetak ${TODAY}</p></div>
  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">${[["Total unit",fmt(T)],["Jenis aset",D.assets.length],["Peminjaman aktif",D.loans.filter(l=>["Menunggu","Dipinjam"].includes(l.status)).length],["Tiket terbuka",D.maint.filter(m=>m.status!=="Selesai").length]].map(x=>`<div class="bg-slate-50 rounded-xl p-3"><div class="text-slate-500">${x[0]}</div><div class="text-xl font-extrabold">${x[1]}</div></div>`).join("")}</div>`+
  tbl(["Kategori","Total Unit","Baik","Rusak Ringan","Rusak Berat","% Layak"],KAT.map(k=>{const t=sum(D.assets.filter(a=>a.kat===k),a=>a.jumlah);return td(k,fmt(t),n(k,"Baik"),n(k,"Rusak Ringan"),n(k,"Rusak Berat"),t?(n(k,"Baik")/t*100).toFixed(1)+"%":"-")}))+`</div>`;
},
pengaturan(){
  const u=D.user,f=(n,l)=>`<label class="block text-xs font-semibold text-slate-600">${l}<input name="${n}" value="${esc(u[n])}" required class="inp mt-1"/></label>`;
  return head("Pengaturan Sistem","Konfigurasi akun, hak akses pengguna, dan identitas instansi.")+
  `<form class="card p-6 grid sm:grid-cols-2 gap-4 max-w-3xl" onsubmit="saveSet(event)">${f("nama","Nama Pengguna")}${f("jabatan","Jabatan")}${f("instansi","Instansi")}${f("prodi","Unit / Program Studi")}<div class="sm:col-span-2 flex gap-2 justify-between"><button type="button" class="btn bo text-rose-600" onclick="resetData()">${ico("restart_alt","!text-base")}Reset Data Contoh</button><button class="btn bp">Simpan Pengaturan</button></div></form>`;
}};

function notifs(){return[...D.loans.filter(l=>l.status==="Menunggu").map(l=>({t:"Peminjaman Baru Membutuhkan Persetujuan",s:`${l.aset} - ${l.peminjam}`,to:"peminjaman",c:"text-slate-800"})),...D.loans.filter(l=>st(l)==="Terlambat").map(l=>({t:"Peminjaman Terlambat",s:`${l.aset} - ${l.peminjam}`,to:"peminjaman",c:"text-rose-700"})),...D.maint.filter(m=>m.status!=="Selesai"&&m.prioritas==="Darurat").map(m=>({t:"Laporan Kerusakan Darurat",s:m.masalah,to:"pemeliharaan",c:"text-amber-800"}))]}
function render(){
  const T=sum(D.assets,a=>a.jumlah),act=D.loans.filter(l=>["Menunggu","Dipinjam"].includes(l.status)).length,em=D.maint.some(m=>m.status!=="Selesai"&&m.prioritas==="Darurat");
  const bdg=id=>id==="barang"?`<span class="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700">${fmt(T)}</span>`:id==="peminjaman"?`<span class="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">${act} Aktif</span>`:id==="pemeliharaan"&&em?`<span class="flex h-2 w-2 relative"><span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span><span class="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span></span>`:"";
  const lbl=t=>`<div class="px-3 pb-2 ${t?"pt-6":""} text-[10px] font-bold text-slate-400 uppercase tracking-widest">${t?"Laporan & Pengaturan":"Menu Utama"}</div>`;
  $("#nav").innerHTML=MENU.map(([id,i,l])=>(id==="dashboard"?lbl(0):id==="laporan"?lbl(1):"")+`<button onclick="go('${id}')" class="nav ${tab===id?"on":""}"><span class="flex items-center gap-3"><span class="material-symbols-outlined text-xl">${i}</span>${l}</span>${bdg(id)}</button>`).join("");
  $("#view").innerHTML=VIEWS[tab]();
  $("#un").textContent=D.user.nama;$("#uj").textContent=D.user.jabatan;$("#ins").textContent=D.user.instansi;$("#prd").textContent=D.user.prodi;
  const N=notifs();$("#nr").classList.toggle("hidden",!N.length);$("#nc").textContent=N.length+" Baru";
  $("#nl").innerHTML=N.map(n=>`<a href="#" onclick="event.preventDefault();go('${n.to}');toggleNotif()" class="block p-3 hover:bg-slate-50"><p class="text-xs font-semibold ${n.c}">${n.t}</p><p class="text-[11px] text-slate-500 mt-0.5">${esc(n.s)}</p></a>`).join("")||'<p class="p-4 text-xs text-slate-400">Tidak ada notifikasi.</p>';
}
function go(t){if(!VIEWS[t])t="dashboard";tab=t;location.hash=t;$("#sidebar").classList.add("-translate-x-full");$("#bd").classList.add("hidden");render();$("#view").scrollTop=0}
function toggleSidebar(){$("#sidebar").classList.toggle("-translate-x-full");$("#bd").classList.toggle("hidden")}
function toggleNotif(){$("#nd").classList.toggle("hidden")}
function onSearch(v){Q=v.trim().toLowerCase();if(Q&&["dashboard","laporan","pengaturan"].includes(tab))go("barang");else render()}
let tt;function toast(m){const t=$("#toast");t.textContent=m;t.classList.remove("hidden");clearTimeout(tt);tt=setTimeout(()=>t.classList.add("hidden"),2500)}

function modal(title,fields,vals,ok,label="Simpan"){
  $("#mt").textContent=title;
  $("#mf").innerHTML=fields.map(f=>`<label class="block text-xs font-semibold text-slate-600 mb-3">${f.l}${f.t==="select"?`<select name="${f.n}" class="inp mt-1">${f.o.map(o=>`<option ${String(vals[f.n])===o?"selected":""}>${esc(o)}</option>`).join("")}</select>`:`<input name="${f.n}" type="${f.t||"text"}" ${f.min?`min="${f.min}"`:""} value="${esc(vals[f.n]??"")}" required class="inp mt-1"/>`}</label>`).join("")+`<div class="flex justify-end gap-2 pt-2"><button type="button" class="btn bo" onclick="closeModal()">Batal</button><button class="btn bp">${label}</button></div>`;
  $("#mf").onsubmit=e=>{e.preventDefault();ok(Object.fromEntries(new FormData(e.target)))};
  $("#modal").classList.remove("hidden");
}
function closeModal(){$("#modal").classList.add("hidden")}
function done(m){save();closeModal();render();toast(m)}
const byId=(arr,id)=>arr.find(x=>x.id===id);

function assetForm(id){
  const a=byId(D.assets,id)||{};
  modal(id?"Edit Aset":"Tambah Aset Baru",[{n:"nama",l:"Nama Aset"},{n:"kat",l:"Kategori",t:"select",o:KAT},{n:"lokasi",l:"Lokasi",t:"select",o:D.rooms.map(r=>r.nama)},{n:"jumlah",l:"Jumlah (Unit)",t:"number",min:1},{n:"kondisi",l:"Kondisi",t:"select",o:KOND}],a,v=>{
    v.jumlah=+v.jumlah;
    if(id)Object.assign(a,v);else D.assets.push({id:"x"+D.seq,kode:"INV-"+String(D.seq++).padStart(3,"0"),...v});
    done(id?"Aset diperbarui":"Aset ditambahkan");
  });
}
function delAsset(id){const a=byId(D.assets,id);if(a&&confirm(`Hapus aset "${a.nama}"?`)){D.assets=D.assets.filter(x=>x.id!==id);done("Aset dihapus")}}
function borrowForm(id){
  const a=byId(D.assets,id)||D.assets[0];
  if(!a)return toast("Tambahkan aset terlebih dahulu");
  modal("Ajukan Peminjaman Sarpras",[{n:"aset",l:"Aset",t:"select",o:D.assets.map(x=>x.nama)},{n:"jml",l:"Jumlah",t:"number",min:1},{n:"peminjam",l:"Nama Peminjam / Unit"},{n:"mulai",l:"Tanggal Pinjam",t:"date"},{n:"selesai",l:"Tanggal Kembali",t:"date"},{n:"perlu",l:"Keperluan"}],{aset:a.nama,jml:1,mulai:TODAY,selesai:dt(1)},v=>{
    const s=D.assets.find(x=>x.nama===v.aset);v.jml=+v.jml;
    if(v.selesai<v.mulai)return toast("Tanggal kembali harus setelah tanggal pinjam");
    if(v.jml>avail(s))return toast(`Stok tersedia hanya ${avail(s)} unit`);
    D.loans.unshift({id:"l"+D.seq++,...v,status:"Menunggu"});done("Pengajuan peminjaman dikirim");
  },"Ajukan");
}
function loanSet(id,s){
  const l=byId(D.loans,id),a=D.assets.find(x=>x.nama===l.aset);
  if(s==="Dipinjam"&&(!a||l.jml>avail(a)))return toast("Stok tidak mencukupi untuk disetujui");
  l.status=s;done("Status peminjaman: "+s);
}
function maintForm(id){
  const a=byId(D.assets,id)||D.assets[0];
  if(!a)return toast("Tambahkan aset terlebih dahulu");
  modal("Lapor Kerusakan",[{n:"aset",l:"Aset",t:"select",o:D.assets.map(x=>x.nama)},{n:"masalah",l:"Deskripsi Masalah"},{n:"prioritas",l:"Prioritas",t:"select",o:["Normal","Darurat"]}],{aset:a.nama,prioritas:"Normal"},v=>{
    const s=D.assets.find(x=>x.nama===v.aset);
    D.maint.unshift({id:"m"+D.seq++,...v,lokasi:s.lokasi,status:"Dilaporkan",tgl:TODAY});done("Laporan kerusakan dibuat");
  },"Kirim Laporan");
}
function maintNext(id){const m=byId(D.maint,id);m.status=m.status==="Dilaporkan"?"Dikerjakan":"Selesai";done("Status tiket: "+m.status)}
function delMaint(id){if(confirm("Hapus tiket ini?")){D.maint=D.maint.filter(m=>m.id!==id);done("Tiket dihapus")}}
function roomForm(){
  modal("Tambah Ruangan",[{n:"nama",l:"Nama Ruangan"},{n:"gedung",l:"Gedung"},{n:"lantai",l:"Lantai",t:"number",min:1},{n:"kap",l:"Kapasitas",t:"number",min:1}],{lantai:1,kap:30},v=>{
    if(D.rooms.some(r=>r.nama.toLowerCase()===v.nama.toLowerCase()))return toast("Nama ruangan sudah ada");
    D.rooms.push({id:"r"+D.seq++,...v,lantai:+v.lantai,kap:+v.kap});done("Ruangan ditambahkan");
  });
}
function delRoom(id){
  const r=byId(D.rooms,id);
  if(D.assets.some(a=>a.lokasi===r.nama))return toast("Pindahkan aset dari ruangan ini terlebih dahulu");
  if(confirm(`Hapus ruangan "${r.nama}"?`)){D.rooms=D.rooms.filter(x=>x.id!==id);done("Ruangan dihapus")}
}
function saveSet(e){e.preventDefault();Object.assign(D.user,Object.fromEntries(new FormData(e.target)));save();render();toast("Pengaturan disimpan")}
function resetData(){if(confirm("Kembalikan semua data ke contoh awal?")){D=seed();save();render();toast("Data direset")}}
function exportCSV(){
  const rows=[["Kode","Nama","Kategori","Lokasi","Jumlah","Kondisi"],...D.assets.map(a=>[a.kode,a.nama,a.kat,a.lokasi,a.jumlah,a.kondisi])];
  const csv=rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(",")).join("\n");
  const a=document.createElement("a");a.href=URL.createObjectURL(new Blob(["\ufeff"+csv],{type:"text/csv"}));a.download="inventaris-sarpras.csv";a.click();toast("CSV diunduh");
}
document.addEventListener("click",e=>{if(!e.target.closest("#nw"))$("#nd").classList.add("hidden")});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){closeModal();$("#nd").classList.add("hidden")}});
const h0=location.hash.slice(1);if(VIEWS[h0])tab=h0;
render();