export const DOMAIN_ORDER = ['CR','CSR','LEG','COH','JUS','RES'];
export const DOMAIN_NAMES = {
  CR:'Yurttaşlık Hakları', CSR:'Yurttaş–Devlet', LEG:'Meşruiyet',
  COH:'Toplumsal Uyum', JUS:'Adalet & Hakkaniyet', RES:'Kriz Direnci'
};
export const DOMAIN_DESCS = {
  CR:'Kimler tam yurttaş sayılıyor, hakları ne kadar güvencede?',
  CSR:'İnsanlar devlete güveniyor mu, sesleri duyuluyor mu?',
  LEG:'Kurumların otoritesi kabul görüyor mu?',
  COH:'Yurttaşlar birbirine güveniyor mu?',
  JUS:'Yükler ve nimetler adil paylaşılıyor mu?',
  RES:'Sistem şoklara uyum sağlayabiliyor mu?'
};
export const IDEAL = {CR:7,CSR:7,LEG:7,COH:7,JUS:7,RES:7};

export const ISLANDS = [
  {id:'polarized',name:'KUTUP ADASI',tag:'Kurumlar güçlü, toplum ikiye bölünmüş.',accent:'#C1502E',domains:{CR:6,CSR:6,LEG:7,COH:2,JUS:3,RES:5}},
  {id:'welfare',name:'REFAH ADASI',tag:'Dayanışma güçlü, güven aşınıyor.',accent:'#2F6F62',domains:{CR:6,CSR:3,LEG:5,COH:8,JUS:6,RES:8}},
  {id:'fragile',name:'KIRILGAN ADA',tag:'Kurumlar ayakta, kimse inanmıyor.',accent:'#6B5B73',domains:{CR:4,CSR:2,LEG:2,COH:5,JUS:4,RES:6}},
  {id:'divided',name:'BÖLÜNMÜŞ ADA',tag:'Haklar geniş, anlatılar çatışıyor.',accent:'#5B4B8A',domains:{CR:8,CSR:5,LEG:6,COH:2,JUS:4,RES:4}},
  {id:'authority',name:'OTORİTE ADASI',tag:'Devlet sağlam, haklar gölgede.',accent:'#7B2D8E',domains:{CR:3,CSR:7,LEG:8,COH:5,JUS:3,RES:6}},
  {id:'adaptive',name:'UYUM ADASI',tag:'Dayanışma yüksek, kurumlar eski.',accent:'#D4783A',domains:{CR:5,CSR:4,LEG:4,COH:7,JUS:5,RES:8}}
];

export const CRISES = [
  {id:'mobilization',eyebrow:'MOBİLİZASYON',text:'Uzun süredir temsil edilmediğini düşünen bir grup sokaklarda. Daha fazla söz hakkı istiyorlar.',options:[
    {label:'İstişare kurulu kur',hint:'Katılımı kurumsallaştırır',deltas:{LEG:1,CR:1},feedback:'Kurul talepleri kurumsal zemine taşıdı.',conditional:{domain:'COH',threshold:5,above:{domain:'COH',delta:0,why:'Uyum zaten güçlü, yeni sesler mevcut dengeyi sarsmadı.'},below:{domain:'COH',delta:-1,why:'Uyum kırılgandı, masaya yeni sesler eklemek gerilimleri görünür kıldı.'}}},
    {label:'Görmezden gel, düzeni koru',hint:'Kısa vadeli sessizlik',deltas:{RES:1,LEG:-1,CR:-1},feedback:'Güven sessizce aşındı.',echo:{text:'Görmezden geldiğin grup örgütlü geri döndü.',deltas:{LEG:-1.5,COH:-1}}},
    {label:'Kısmi taviz ver, geçiştir',hint:'Zaman kazandırır',deltas:{COH:0.5,LEG:-0.5},feedback:'Sakinlik, ertelenmiş hesaplaşma.'}
  ]},
  {id:'migration',eyebrow:'GÖÇ DALGASI',text:'Komşu adadan binlerce kişi kıyıya ulaştı. Barınma yardımı isteyenler de var, sınır kapatılsın diyenler de.',options:[
    {label:'Hızlı entegrasyon başlat',hint:'Gelenleri içeri alır',deltas:{CR:1},conditional:{domain:'COH',threshold:6,above:{domain:'COH',delta:-1,why:'Sıkı toplum yeni gelenleri tehdit algıladı.'},below:{domain:'COH',delta:1,why:'Ortak proje farklı kesimleri buluşturdu.'}},feedback:'Entegrasyon dengeleri yeniden şekillendirdi.'},
    {label:'Geçici kabul merkezleri kur',hint:'Sorunu erteler',deltas:{RES:0.5,JUS:-0.5},feedback:'Merkezler doldu, sorun görünmez kılındı.',echo:{text:'Kabul merkezi koşulları skandala dönüştü.',deltas:{JUS:-1.5,LEG:-1}}},
    {label:'Sınırı kapat, halkoyuna sun',hint:'Çoğunluk iradesi',deltas:{COH:1,CR:-1,JUS:-1},feedback:'Çoğunluk memnun, oy hakkı olmayanlar için sonuç baştan belliydi.'}
  ]},
  {id:'polarization',eyebrow:'KUTUPLAŞMA',text:'İki kamp birbirini varoluşsal tehdit sayıyor. Ortak gerçeklik zemini kalmadı.',options:[
    {label:'Çok taraflı müzakere forumu',hint:'Çatışmayı kanalize eder',deltas:{LEG:1},conditional:{domain:'LEG',threshold:6,above:{domain:'COH',delta:1,why:'Meşruiyet yeterliydi, forum köprü kurdu.'},below:{domain:'COH',delta:0,why:'Kurumlara güven düşük, forum etkisiz kaldı.'}},feedback:'Forum çatışmayı konuşulabilir hale getirdi.'},
    {label:'Bir tarafı bastır, diğerini destekle',hint:'Hızlı birlik görüntüsü',deltas:{COH:1,CR:-1,LEG:-1},feedback:'Bir kesim sustu ama gitmedi.',echo:{text:'Bastırılan kesim yeraltında örgütlendi.',deltas:{LEG:-1.5,RES:-1}}},
    {label:'Gündemi değiştir, soğumaya bırak',hint:'Bekle ve gör',deltas:{LEG:-0.5,RES:-0.5},feedback:'Kutuplaşma manşetlerden çekildi, sofralardan çekilmedi.'}
  ]},
  {id:'recession',eyebrow:'EKONOMİK ŞOK',text:'Kur şoku haneleri vurdu. İcra dalgası kapıda.',options:[
    {label:'Borç yapılandırma + kamu desteği',hint:'Kırılganları korur',deltas:{JUS:1,COH:0.5},conditional:{domain:'RES',threshold:6,above:{domain:'RES',delta:1,why:'Güçlü kapasite krizi fırsata çevirdi.'},below:{domain:'RES',delta:0,why:'Destek gecikmeli ulaştı.'}},feedback:'Tahliyeler durduruldu.'},
    {label:'Piyasaya bırak, müdahale etme',hint:'İlkesel tutarlılık',deltas:{RES:0.5,JUS:-1,COH:-1},feedback:'Piyasa dengesini buldu, aileler bulamadı.'},
    {label:'Yalnızca bankaları kurtar',hint:'Sistem ayakta, adalet yok',deltas:{LEG:0.5,JUS:-1,COH:-0.5},feedback:'Kurallar kimin için?',echo:{text:'Banka kurtarmanın bedelini ödeyenler protestoda.',deltas:{LEG:-1.5,CSR:-1}}}
  ]}
];

export const ARCHETYPES = [
  {name:'Hobbesçu Güvenlikçi',desc:'Düzen ve istikrarı her şeyin önüne koydun. Güvenlik için katılımdan feragat ettin.'},
  {name:'Lockeçu Hak Savunucusu',desc:'Bireysel hakları önceliklendirdin, ama kapsayıcılığı sınırlı tuttun.'},
  {name:'Rousseaucu Müzakereci',desc:'Katılım ve ortak iradeyi merkeze aldın; çoğunluk iradesi ön plondaydı.'},
  {name:'Rawlsçı Vasi',desc:'Kapsayıcılık ve tarafsız adaleti önceliklendirdin.'},
  {name:'Buchanancı Pazarlıkçı',desc:'Kararlarını pragmatik pazarlıkla şekillendirdin.'}
];

export const DOMAIN_DETAILS = {
  CR: {
    deep: `Bir toplumun tam üyeliğini tanımlayan hak ve yükümlülükler bütünü. Doğal hakların hukuki/insan haklarına dönüşümünü, yurttaşlığın karşılıklılığını ve zaman içinde kimlerin "tam yurttaş" sayıldığının genişleyip daralmasını kapsar. Kritik yaklaşımlar, tarihsel olarak kadınların, azınlıkların ve göçmenlerin bu tam üyelikten nasıl dışlandığını da bu alanın parçası sayar.`,
    subdomains: ['Hakların korunduğuna dair farkındalık', 'Yurttaşlık haklarına aşinalık', 'Yurttaşlık sorumluluğu duygusu', 'Hakların genişlemesi ve kapsayıcılığı'],
    theory: `Locke (doğal haklar) ve Rousseau (ortak iyiye katılım) + Pateman/Mills'in dışlama eleştirisi`,
    gameNote: `Göç, mobilizasyon ve dezenformasyon krizlerinde kimin "içeride" sayıldığı bu boyuta işler.`
  },
  CSR: {
    deep: `Yönetenle yönetilen arasındaki çok yönlü bağ: hem somut çıktılar (kamu hizmeti, refah) hem de sembolik/duygusal bağlar (aidiyet, güven). Sözleşmenin kararlı olması için hem yukarıdan aşağı meşru bir hukuki temel hem de aşağıdan yukarı yurttaş desteği ve özdeşleşmesi gerekir.`,
    subdomains: ['Devlet kapasitesi ve performansı', 'Siyasi aidiyet ve kimlik', 'Devletle deneyimsel ilişki', 'Kurumların duyarlılığı algısı'],
    theory: `Siyasi yükümlülük ve meşruiyet kuramları — devletin hem sağlayıcı hem de temsilci rolü`,
    gameNote: `Dezenformasyon krizindeki "bağımsız kurum" seçeneği bu boyutun eşiğine göre farklı sonuç verir (csrGate mekaniği).`
  },
  LEG: {
    deep: `İnsanların özgürlüklerinden neden vazgeçip bir siyasi düzene rıza gösterdiğinin cevabı. Hem biçimsel/hukuki temeli (yasalar, prosedürler) hem de normatif rıza temelini kapsar. Yönetim yalnızca "doğru" kabul edildiğinde meşrudur — güç kullanmakla meşru otorite arasındaki fark tam da budur.`,
    subdomains: ['Kurumlara güven', 'Prosedürel meşruiyet', 'Uyum ve rıza', 'Sistemin adil algılanması'],
    theory: `Weberyen otorite tipolojisi + Rawlsçı ve eleştirel demokrasi kuramları`,
    gameNote: `Kutuplaşma ve mobilizasyon krizlerinde kurumların "kabul görüp görmediği" doğrudan bu boyutu belirler.`
  },
  COH: {
    deep: `Devletle değil, yurttaşların birbiriyle kurduğu yatay bağların kalitesi: güven, dayanışma, farklılıklara rağmen kabul görme. Bir sözleşmenin dayanıklı olması için yalnızca devlete güven yetmez — yurttaşların birbirine güvenmesi ve farklılıklar karşısında dayanışma göstermesi gerekir.`,
    subdomains: ['Kişilerarası güven', 'Tanınma ve kapsayıcılık', 'Ayrımcılık ve eşitsizlik algısı', 'Duygusal kutuplaşma'],
    theory: `Cemaatçi (communitarian) ve müzakereci demokrasi gelenekleri`,
    gameNote: `Dışlayıcı Ada gibi profillerde yüksek COH, düşük CR/JUS ile birlikte gelebilir — "sıkı ama dar" bir dayanışmayı gösterir.`
  },
  JUS: {
    deep: `Sosyal sözleşme düşüncesinin normatif çekirdeği: toplumsal yapılar adalet, tarafsızlık ve eşitlik ilkeleriyle ne kadar örtüşüyor? Rawls'ın "bilgisizlik peçesi" fikrine, ayrıca feminist ve eleştirel ırk kuramlarının klasik sözleşmelere yönelttiği yapısal eşitsizlik eleştirilerine dayanır.`,
    subdomains: ['Ekonomik eşitsizlik algısı', 'Liyakate inanç', 'Prosedürel adalet', 'Sistemik önyargıya yapısal eleştiri'],
    theory: `Rawls (bilgisizlik peçesi, fark ilkesi) — mutual-advantage (Gauthier/Buchanan) ile impartiality (Barry/Scanlon) ayrımı`,
    gameNote: `Ekonomik şok ve çevresel şok krizlerinde "kim öder" sorusu bu boyutu doğrudan sınar.`
  },
  RES: {
    deep: `Sosyal sözleşmelerin sabit değil, dinamik ve koşullara bağlı olduğunu kabul eder: toplumlar sistemik streslere, krizlere ve baskılara nasıl yanıt veriyor? Pandemi, iklim şoku, ekonomik durgunluk gibi krizlere verilen yanıtları ve popülizme karşı demokratik direnci kapsar.`,
    subdomains: ['Kriz yanıtı değerlendirmesi', 'Demokratik direnç ve yenilikler', 'Geleceğe güven', 'Otoriter kaymaya direnç'],
    theory: `Polikriz çağında sözleşmelerin uyum ve yenilenme kapasitesi üzerine güncel literatür`,
    gameNote: `Direnç Puanı bu boyutla karıştırılmamalı: RES bir girdi değişken, Direnç Puanı altı boyutun bileşik dengesidir.`
  }
};

export function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
export function fmt(n){return (Math.round(n*10)/10).toString();}
