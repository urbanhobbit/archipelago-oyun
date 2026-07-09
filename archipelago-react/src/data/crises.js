// Kriz kartları — her opsiyon: label, hint, axis{p,i,j}, deltas{domain:delta},
// opsiyonel conditional{domain,threshold,above:{deltas,why},below:{deltas,why}},
// opsiyonel csrGate{threshold,bonus:{domain,delta,msg}}, opsiyonel echo{text,deltas}, feedback.
export const CRISES = [
  {id:'disinfo',eyebrow:'DEZENFORMASYON ŞOKU',text:'Yabancı kaynaklı bir manipülasyon ağı, seçim sisteminin hileli olduğuna dair sentetik kanıtlar yayıyor. Halkın bir kısmı sonuçları tanımayacağını ilan etti. Sokaklarda gerilim hızla tırmanıyor.',options:[
    {label:'İnterneti kısıtla ve şüpheli haber kaynaklarını kapat',hint:'Düzeni hızla sağlar ancak temel özgürlükleri askıya alır',axis:{p:-1.0,i:-0.5,j:-0.5},deltas:{CR:-2,LEG:1,RES:1},
      feedback:'Sokaklar sakinledi, ama "kimin sesi susturuldu" sorusu havada asılı kaldı.',
      echo:{text:'Sansürün Bedeli: kısıtlamalar devlete duyulan güveni sessizce aşındırdı.',deltas:{CSR:-2}}},
    {label:'Şeffaf bilgi ağları ve bağımsız teyit platformları kur',hint:'Toplumsal diyalog yaratır ancak kriz anında yavaş işleyebilir',axis:{p:1.0,i:1.0,j:0.0},
      conditional:{domain:'COH',threshold:5,
        above:{deltas:{CSR:2,RES:1},why:'Yüksek güven ortamında teyit mekanizmaları yankı odalarını hızla aştı.'},
        below:{deltas:{RES:-1},why:'Düşük güven ortamında teyit çabaları kutuplaşmayı kıramadı.'}},
      feedback:'Doğrulama ağları kuruldu; etkisi, toplumun birbirine ne kadar güvendiğine bağlı çıktı.'},
    {label:'Yalnızca resmi kurumların tek taraflı açıklamalarını destekle',hint:'Kurumsal otoriteyi korur, sivil sesleri sistemin dışına iter',axis:{p:-0.5,i:-0.5,j:0.0},deltas:{CSR:-1,LEG:1,COH:-1},
      feedback:'Resmi ağız tek kaynak oldu; inanmayanlar için susturulmuş sayıldı.'}
  ]},
  {id:'polarization',eyebrow:'KUTUPLAŞMA PATLAMASI',text:'Adanın iki büyük toplumsal grubu arasında geçmişten gelen tarihi bir fay hattı kırıldı. Sembolik bir anıtın tahrip edilmesiyle başlayan olaylar, mahalleler arası çatışmalara dönüşmek üzere.',options:[
    {label:'Kolluk kuvvetlerini sokağa indirip sokağa çıkma yasakları ilan et',hint:'Çatışmayı dondurur, ancak alttan yatan sorunu çözmez',axis:{p:-1.0,i:-1.0,j:-1.0},deltas:{COH:-2,RES:2,CR:-1},
      feedback:'Sokaklar boşaldı; öfke görünmez oldu, kaybolmadı.',
      echo:{text:'Bastırılmış Öfke: sessizlik altında gerilim birikmeye devam ediyor.',deltas:{LEG:-1,COH:-1}}},
    {label:'Bağımsız bir hakikat ve uzlaşı komisyonu topla',hint:'Geçmişle yüzleşmeyi sağlar, adaleti tesis etmeye odaklanır',axis:{p:0.5,i:1.0,j:1.0},
      conditional:{domain:'LEG',threshold:4,
        above:{deltas:{COH:2,JUS:1},why:'Kurumlara olan inanç, tarafları aynı masaya oturmaya ikna etti.'},
        below:{deltas:{LEG:-1,COH:-1},why:'Zayıf meşruiyet, komisyon kararlarının taraflı bulunmasına yol açtı.'}},
      feedback:'Komisyon kuruldu; sonucu, kurumlara ne kadar inanıldığına bağlı çıktı.'},
    {label:'Yalnızca anıtı tahrip edenleri hızlıca yargıla ve cezalandır',hint:'Mevcut yasaları katı şekilde uygular, toplumsal yarayı görmezden gelir',axis:{p:0.0,i:-0.5,j:0.5},deltas:{LEG:1,JUS:1,COH:-1},
      feedback:'Adalet yerini buldu, ama sadece bir tarafın gözünde.'}
  ]},
  {id:'migration',eyebrow:'GÖÇ DALGASI',text:'Komşu kıtadaki bir kriz nedeniyle binlerce sığınmacı aniden kıyılara ulaştı. Barınma ve gıda altyapısı son derece yetersiz. Yerel halk kaynakların tükenmesinden büyük endişe duyuyor.',options:[
    {label:'Sınırları tamamen kapat ve gelenleri derhal geri gönder',hint:'Kısa vadeli yerel rahatlama sağlar, evrensel hakları yok sayar',axis:{p:-0.5,i:-1.0,j:-1.0},deltas:{RES:1,COH:1,JUS:-2,CR:-2},
      feedback:'Yerel halk rahatladı; kapının dışında kalanlar hesaba katılmadı.'},
    {label:'Sığınmacılara temel haklar ve acil barınma tesisleri sağla',hint:'Yükü adil dağıtmaya çalışır, sistemi kısa vadede zorlar',axis:{p:0.0,i:1.0,j:1.0},deltas:{JUS:2,CR:1,RES:-2,COH:-1},
      feedback:'Haklar genişledi, ama sistemin taşıma kapasitesi zorlandı.'},
    {label:'Sığınmacıları acil yerel iş gücü açıklarına yönlendir',hint:'Pragmatik bir karşılıklı çıkar alanı yaratır',axis:{p:0.0,i:0.0,j:-0.5},
      conditional:{domain:'COH',threshold:5,
        above:{deltas:{RES:2,CSR:1},why:'Toplumun dışlayıcı olmaması, yeni gelenlerin ekonomiye entegrasyonunu hızlandırdı.'},
        below:{deltas:{JUS:-1,COH:-1},why:'Kutuplaşmış toplumda bu hamle, göçmenlerin ucuz iş gücü olarak sömürüldüğü algısı yarattı.'}},
      feedback:'İş gücü açığı kapandı; algı, toplumun ne kadar kapsayıcı olduğuna bağlı şekillendi.'}
  ]},
  {id:'recession',eyebrow:'EKONOMİK ŞOK',text:'Küresel tedarik zincirleri aniden koptu. Adada temel gıda ve enerji fiyatları üçe katlandı. Dar gelirliler için yaşam sürdürülemez hale geldi ve iflaslar başladı.',options:[
    {label:'Büyük şirketlere acil vergi indirimi ve kurtarma paketi ver',hint:'Üretim kapasitesini korur, yükü alt sınıflara bırakır',axis:{p:-0.5,i:-0.5,j:-1.0},deltas:{RES:2,JUS:-2,COH:-1},
      feedback:'Üretim çarkı döndü; faturayı kimin ödediği belliydi.'},
    {label:'Temel gıda ve enerjiyi kamulaştırarak tabana dağıt',hint:'Kırılganları doğrudan korur, serbest piyasa dengelerini bozar',axis:{p:0.0,i:1.0,j:1.0},
      conditional:{domain:'LEG',threshold:5,
        above:{deltas:{JUS:2,CSR:1},why:'Güçlü kurumlar dağıtımı adil ve kayırmasız gerçekleştirdi.'},
        below:{deltas:{CSR:-2,JUS:-1},why:'Zayıf devlet kapasitesi dağıtımda yolsuzluk iddialarını tetikledi.'}},
      feedback:'Kamulaştırma uygulandı; adil mi kayırmacı mı olduğu, kurumlara duyulan güvene bağlı çıktı.'},
    {label:'Piyasaya müdahale etme, fiyatların kendiliğinden dengelenmesini bekle',hint:'Sistemin olağan akışına güvenir, zayıfları korumasız bırakır',axis:{p:0.0,i:0.0,j:0.0},deltas:{},
      feedback:'Fiyatlar zamanla dengeye oturdu; o zamana kadar dayanamayanlar için tesellisi olmadı.',
      echo:{text:'Derinleşen Yoksulluk: bekleme süresinin faturası tabana yıkıldı.',deltas:{COH:-2,JUS:-2}}}
  ]},
  {id:'environmental',eyebrow:'ÇEVRESEL ŞOK',text:'Beklenmedik şiddette bir fırtına adanın tarım alanlarını ve su şebekesini yok etti. Şiddetli gıda kıtlığı kapıda ve yerel altyapı tamamen çökmüş durumda.',options:[
    {label:'Yerel halkı bölgesel kriz yönetimi komitelerine dahil et',hint:'Çözümü tabandan inşa eder, organizasyonu zaman alabilir',axis:{p:1.0,i:1.0,j:0.0},
      conditional:{domain:'CSR',threshold:4,
        above:{deltas:{COH:2,RES:1},why:'Devlet ve yurttaş işbirliği yerel dayanışmayı harika bir şekilde ayağa kaldırdı.'},
        below:{deltas:{RES:-2},why:'Devlete güvensizlik, komitelerin işleyişini başından bloke etti.'}},
      feedback:'Komiteler kuruldu; başarısı, devlete duyulan güvenle doğru orantılı çıktı.'},
    {label:'Ordunun kontrolünde sıkı bir merkezi karne sistemi kur',hint:'Kaynak dağıtımını disipline eder, sivil inisiyatifleri sıfırlar',axis:{p:-1.0,i:0.0,j:-0.5},deltas:{RES:2,CSR:-1},
      feedback:'Kaynaklar düzenli dağıtıldı; inisiyatif alanı ise kapandı.'},
    {label:'Kaynak onarımını tamamen özel lojistik şirketlerine devret',hint:'Hızlı donanım sağlar ancak hizmete erişim cüzdana bağlıdır',axis:{p:-0.5,i:-0.5,j:-1.0},deltas:{RES:1,JUS:-2},
      feedback:'Onarım hızlandı; erişim ise ödeme gücüyle sınırlandı.'}
  ]},
  {id:'mobilization',eyebrow:'MOBİLİZASYON',text:'Artan barınma maliyetlerine karşı binlerce genç, merkezi meydanlarda çadır kurarak süresiz sivil itaatsizlik eylemi başlattı. Kamusal alanlarda günlük işleyiş durma noktasına geldi.',options:[
    {label:'Eylemi yasadışı ilan et ve güç kullanarak hızla dağıt',hint:'Otoriteyi tavizsiz korur, devlet ile gençlerin bağını koparır',axis:{p:-1.0,i:-1.0,j:-1.0},deltas:{LEG:1,CR:-2,CSR:-1},
      feedback:'Meydanlar boşaltıldı; bir kuşakla köprüler de yakılmış oldu.',
      echo:{text:'Kayıp Kuşak: dağıtılan eylemin izleri, gençlerle devlet arasındaki bağda kalıcı hasar bıraktı.',deltas:{CSR:-1,COH:-1}}},
    {label:'Eylemci temsilcilerini doğrudan karar alma meclisine davet et',hint:'Talepleri siyasi sisteme taşır, radikalleşmeyi önler',axis:{p:1.0,i:1.0,j:0.5},
      conditional:{domain:'LEG',threshold:4,
        above:{deltas:{CSR:2,COH:1},why:'Sisteme duyulan güven, sokaktaki enerjiyi yapıcı bir politikaya dönüştürdü.'},
        below:{deltas:{LEG:-1,RES:-1},why:'Temsilciler devlete güvenmediği için masaya oturmayı reddetti.'}},
      feedback:'Davet çıkarıldı; kabul görüp görmediği, kurumlara duyulan güvene bağlı çıktı.'},
    {label:'Sadece geçici barınma yardımları açıklayarak eylemi sönümlendir',hint:'Kısa vadeli maddi tavizler verir, yapısal sorunu görmezden gelir',axis:{p:0.0,i:0.0,j:-0.5},deltas:{RES:1,JUS:-1,LEG:-1},
      feedback:'Çadırlar kalktı; talep listesi çekmeceye kalktı.'}
  ]}
];
