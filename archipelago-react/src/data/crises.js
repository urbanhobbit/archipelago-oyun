// Kriz kartları — her opsiyon: label, hint, axis{p,i,j}, deltas{domain:delta},
// opsiyonel conditional{domain,threshold,above:{deltas,why},below:{deltas,why}},
// opsiyonel csrGate{threshold,bonus:{domain,delta,msg}}, opsiyonel echo{text,deltas}, feedback.
export const CRISES = [
  {id:'disinfo',eyebrow:'DEZENFORMASYON ŞOKU',text:'Kaynağı belirsiz sahte bir kriz haberi anda yayıldı. Panik satışları başladı, sokakta gerginlik büyüyor — ama tehdidin kendisi gerçek değil.',options:[
    {label:'Bağımsız doğrulama kurumu kur',hint:'Yavaş ama kalıcı güven inşa eder',axis:{p:-0.5,i:0.5,j:0.5},deltas:{LEG:0.5},
      csrGate:{threshold:5,bonus:{domain:'CSR',delta:1,msg:'Devlete güven zaten vardı, bağımsız kurum bu güveni pekiştirdi.'}},
      feedback:'Doğrulama kurumu kuruldu; etkisi, insanların devlete zaten ne kadar güvendiğine bağlı çıktı.'},
    {label:'Devlet kanalından resmi yalanlama yayınla',hint:'Hızlı ama tek taraflı',axis:{p:1,i:-0.3,j:-0.2},deltas:{LEG:0.5,CR:-0.5},
      feedback:'Resmi açıklama paniği durdurdu, ama "devlet konuşunca inanır mısın" sorusu ortada kaldı.',
      echo:{text:'Resmi yalanlamanın kendisi de sorgulanır oldu.',deltas:{LEG:-1,CSR:-0.5}}},
    {label:'Platformlara içerik kaldırma baskısı yap',hint:'Sansür tartışması açar',axis:{p:1.3,i:-1,j:0},deltas:{RES:0.5,CR:-1},
      feedback:'Yayılım durdu, ama "kim neyin yalan olduğuna karar veriyor" sorusu havada kaldı.'}
  ]},
  {id:'polarization',eyebrow:'KUTUPLAŞMA PATLAMASI',text:'İki kamp birbirini varoluşsal tehdit sayıyor. Ortak bir gerçeklik zemini kalmadı, her haber kanıt yerine silah olarak kullanılıyor.',options:[
    {label:'Çok taraflı müzakere forumu kur',hint:'Çatışmayı kanalize eder',axis:{p:-0.8,i:0.5,j:0.3},deltas:{LEG:0.5},
      conditional:{domain:'LEG',threshold:6,
        above:{deltas:{COH:1,LEG:0.5},why:'Kurumlara güven yeterliydi, forum gerçek bir köprü kurdu.'},
        below:{deltas:{COH:0,LEG:-0.5},why:'Kurumlara güven düşüktü, forum sahte bir jest olarak görüldü.'}},
      feedback:'Forum, çatışmayı en azından konuşulabilir kıldı.'},
    {label:'Bir tarafı bastır, diğerini destekle',hint:'Hızlı birlik görüntüsü',axis:{p:1.5,i:-1.3,j:-0.5},deltas:{COH:1,CR:-1,LEG:-1},
      feedback:'Bir kesim sustu, ama gitmedi.',
      echo:{text:'Bastırılan kesim yeraltında örgütlendi.',deltas:{LEG:-1.5,RES:-1}}},
    {label:'Gündemi değiştir, soğumaya bırak',hint:'Bekle ve gör',axis:{p:0,i:0,j:-0.3},deltas:{LEG:-0.5,RES:-0.5},
      feedback:'Kutuplaşma manşetlerden çekildi, sofralardan çekilmedi.'}
  ]},
  {id:'migration',eyebrow:'GÖÇ DALGASI',text:'Komşu adadan binlerce kişi kıyıya ulaştı. Kimi barınma yardımı istiyor, kimi sınırın kapatılmasını.',options:[
    {label:'Hızlı entegrasyon başlat',hint:'Gelenleri içeri alır',axis:{p:-0.5,i:1.3,j:0.5},deltas:{CR:1},
      conditional:{domain:'COH',threshold:6,
        above:{deltas:{COH:-1},why:'Sıkı ve kapalı bir toplum yeni gelenleri tehdit olarak algıladı.'},
        below:{deltas:{COH:1},why:'Ortak bir proje, zaten gevşek olan bağları yeniden örmeye yaradı.'}},
      feedback:'Entegrasyon, adanın kendi iç dengelerini de yeniden şekillendirdi.'},
    {label:'Geçici kabul merkezleri kur',hint:'Sorunu erteler',axis:{p:0.5,i:-0.2,j:-0.5},deltas:{RES:0.5,JUS:-0.5},
      feedback:'Merkezler doldu, sorun gözden ırak tutuldu.',
      echo:{text:'Kabul merkezindeki koşullar skandala dönüştü.',deltas:{JUS:-1.5,LEG:-1}}},
    {label:'Sınırı kapat, halkoyuna sun',hint:'Çoğunluk iradesi',axis:{p:0.3,i:-1.3,j:-1},deltas:{COH:1,CR:-1,JUS:-1},
      feedback:'Çoğunluk memnun kaldı; oy hakkı olmayanlar için sonuç zaten baştan belliydi.'}
  ]},
  {id:'recession',eyebrow:'EKONOMİK ŞOK',text:'Kur şoku haneleri vurdu, icra dalgası kapıda. Herkes "kim öder" sorusunu soruyor.',options:[
    {label:'Borç yapılandırma + kamu desteği',hint:'Kırılganları korur',axis:{p:0.3,i:0.5,j:1.3},deltas:{JUS:1,COH:0.5},
      conditional:{domain:'RES',threshold:6,
        above:{deltas:{RES:1,COH:0.5},why:'Güçlü kriz kapasitesi desteği hızla yerine ulaştırdı, dayanışmayı da güçlendirdi.'},
        below:{deltas:{RES:-0.5},why:'Kapasite zayıftı, destek gecikti ve yetersiz kaldı.'}},
      feedback:'Tahliyeler durduruldu; maliyeti kimin üstleneceği sorusu ötelendi.'},
    {label:'Piyasaya bırak, müdahale etme',hint:'İlkesel tutarlılık',axis:{p:-0.5,i:-0.3,j:-1.3},deltas:{RES:0.5,JUS:-1,COH:-1},
      feedback:'Piyasa kendi dengesini buldu; aileler bulamadı.'},
    {label:'Yalnızca bankaları/büyük şirketleri kurtar',hint:'Sistem ayakta, adalet tartışmalı',axis:{p:1,i:-0.5,j:-1.3},deltas:{LEG:0.5,JUS:-1,COH:-0.5},
      feedback:'Kurallar birileri için işledi.',
      echo:{text:'Kurtarmanın bedelini ödeyenler sokakta.',deltas:{LEG:-1.5,CSR:-1}}}
  ]},
  {id:'environmental',eyebrow:'ÇEVRESEL ŞOK',text:'Art arda gelen kuraklık ve sel tarım bölgelerini vurdu. Su ve gıda kıtlığı büyüyor; bazı bölgeler diğerlerinden çok daha ağır etkilendi.',options:[
    {label:'Acil kaynak paylaşım planı uygula',hint:'Eşit dağıtım, yavaş uygulama',axis:{p:0.3,i:0.5,j:1.3},deltas:{JUS:1,RES:0.5},
      conditional:{domain:'COH',threshold:5,
        above:{deltas:{COH:0.5},why:'Dayanışma zaten güçlüydü, ortak fedakârlık kolay kabul gördü.'},
        below:{deltas:{COH:-1},why:'Güven zayıfken paylaşım planı "bize değil onlara" tepkisiyle karşılandı.'}},
      feedback:'Kaynaklar paylaşıldı, ama herkes adil payını aldığına ikna olmadı.'},
    {label:'En çok etkilenen bölgeye öncelik ver',hint:'Hedefli ama ayrımcı algılanabilir',axis:{p:0.5,i:-0.5,j:0.3},deltas:{RES:1,COH:-0.5},
      feedback:'Hasar kontrol altına alındı, ama "neden onlar önce" sorusu yayıldı.'},
    {label:'Piyasa fiyatlamasına bırak, sübvansiyon yok',hint:'Devlet müdahale etmez',axis:{p:-0.8,i:-0.5,j:-1.3},deltas:{RES:-0.5,JUS:-1},
      feedback:'Fiyatlar dengeyi buldu, en yoksullar bulamadı.',
      echo:{text:'Gıda fiyatları protestoya dönüştü.',deltas:{COH:-1,LEG:-1}}}
  ]},
  {id:'mobilization',eyebrow:'MOBİLİZASYON',text:'Uzun süredir temsil edilmediğini düşünen bir grup sokakta; sivil itaatsizlik eylemleri büyüyor. Daha fazla söz hakkı istiyorlar.',options:[
    {label:'İstişare kurulu kur',hint:'Katılımı kurumsallaştırır',axis:{p:-0.8,i:1,j:0.3},deltas:{LEG:1,CR:1},
      conditional:{domain:'COH',threshold:5,
        above:{deltas:{COH:0},why:'Uyum zaten güçlüydü, yeni sesler mevcut dengeyi sarsmadı.'},
        below:{deltas:{COH:-1},why:'Uyum kırılgandı; masaya yeni sesler eklemek gerilimleri görünür kıldı.'}},
      feedback:'Kurul, talepleri kurumsal bir zemine taşıdı.'},
    {label:'Görmezden gel, düzeni koru',hint:'Kısa vadeli sessizlik',axis:{p:1.3,i:-1,j:-0.3},deltas:{RES:1,LEG:-1,CR:-1},
      feedback:'Sessizlik satın alındı, ama ucuz değildi.',
      echo:{text:'Görmezden gelinen grup, çok daha örgütlü biçimde geri döndü.',deltas:{LEG:-1.5,COH:-1}}},
    {label:'Kısmi taviz ver, geçiştir',hint:'Zaman kazandırır ama çözmez',axis:{p:0,i:0.3,j:0},deltas:{COH:0.5,LEG:-0.5},
      feedback:'Sakinlik geldi; hesaplaşma sadece ertelendi.'}
  ]}
];
