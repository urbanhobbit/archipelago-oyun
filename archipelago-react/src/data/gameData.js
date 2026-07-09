export const DOMAIN_ORDER = ['CR','CSR','LEG','COH','JUS','RES'];
export const DOMAIN_NAMES = {
  CR: {tr:'Yurttaşlık Hakları', en:'Citizenship Rights'},
  CSR: {tr:'Yurttaş–Devlet', en:'Citizen–State'},
  LEG: {tr:'Meşruiyet', en:'Legitimacy'},
  COH: {tr:'Toplumsal Uyum', en:'Social Cohesion'},
  JUS: {tr:'Adalet & Hakkaniyet', en:'Justice & Fairness'},
  RES: {tr:'Kriz Direnci', en:'Crisis Resilience'}
};
export const DOMAIN_DESCS = {
  CR: {tr:'Kimler tam yurttaş sayılıyor, hakları ne kadar güvencede?', en:'Who counts as a full citizen, and how secure are their rights?'},
  CSR: {tr:'İnsanlar devlete güveniyor mu, sesleri duyuluyor mu?', en:'Do people trust the state, and are their voices heard?'},
  LEG: {tr:'Kurumların otoritesi kabul görüyor mu?', en:'Is the authority of institutions accepted?'},
  COH: {tr:'Yurttaşlar birbirine güveniyor mu?', en:'Do citizens trust one another?'},
  JUS: {tr:'Yükler ve nimetler adil paylaşılıyor mu?', en:'Are burdens and benefits shared fairly?'},
  RES: {tr:'Sistem şoklara uyum sağlayabiliyor mu?', en:'Can the system adapt to shocks?'}
};
export const IDEAL = {CR:7,CSR:7,LEG:7,COH:7,JUS:7,RES:7};

export const ISLANDS = [
  {id:'polarized',name:{tr:'KUTUP ADASI',en:'POLARIZED ISLAND'},tag:{tr:'Kurumlar güçlü, toplum ikiye bölünmüş.',en:'Institutions are strong, society is split in two.'},accent:'#C1502E',domains:{CR:6,CSR:6,LEG:7,COH:2,JUS:3,RES:5},difficulty:3,
    detail:{tr:'Kurumlar kağıt üzerinde sağlam, meşruiyet yüksek. Ama toplum iki kampa bölünmüş durumda; yurttaşlar birbirine güvenmiyor ve adalet algısı zayıf. Küçük bir kıvılcım bile kutuplaşmayı alevlendirebilir.',en:'Institutions are solid on paper, legitimacy is high. But society is split into two camps; citizens don\'t trust one another and the sense of justice is weak. Even a small spark can ignite polarization.'},
    strengths:{tr:['Güçlü hukuki-kurumsal temel (LEG 7)','Haklar büyük ölçüde tanınıyor (CR 6)'],en:['Strong legal-institutional foundation (LEG 7)','Rights are largely recognized (CR 6)']},
    risks:{tr:['Toplumsal uyum kritik seviyede (COH 2)','Adalet algısı zayıf (JUS 3)'],en:['Social cohesion at a critical level (COH 2)','Weak sense of justice (JUS 3)']}},
  {id:'welfare',name:{tr:'REFAH ADASI',en:'WELFARE ISLAND'},tag:{tr:'Dayanışma güçlü, güven aşınıyor.',en:'Solidarity is strong, trust is eroding.'},accent:'#2F6F62',domains:{CR:6,CSR:3,LEG:5,COH:8,JUS:6,RES:8},difficulty:2,
    detail:{tr:'Yurttaşlar birbirine sıkı sıkıya bağlı, dayanışma ağları güçlü ve kriz anında toparlanma kapasitesi yüksek. Ama devletle kurulan ilişki zayıf — insanlar birbirine güveniyor, kuruma değil.',en:'Citizens are tightly bonded, solidarity networks are strong, and recovery capacity in a crisis is high. But the relationship with the state is weak — people trust each other, not the institution.'},
    strengths:{tr:['Yüksek toplumsal dayanışma (COH 8)','Güçlü kriz direnci (RES 8)'],en:['High social solidarity (COH 8)','Strong crisis resilience (RES 8)']},
    risks:{tr:['Devlete güven düşük (CSR 3)'],en:['Low trust in the state (CSR 3)']}},
  {id:'fragile',name:{tr:'KIRILGAN ADA',en:'FRAGILE ISLAND'},tag:{tr:'Kurumlar ayakta, kimse inanmıyor.',en:'Institutions still stand, but no one believes in them.'},accent:'#6B5B73',domains:{CR:4,CSR:2,LEG:2,COH:5,JUS:4,RES:6},difficulty:5,
    detail:{tr:'Kurumlar hâlâ ayakta duruyor ama kimse onlara inanmıyor. Meşruiyet ve devlet güveni çökme noktasında; her karar hem kısa vadeli hasarı önlemek hem de temeli yeniden inşa etmek arasında sıkışıyor.',en:'Institutions still stand, but no one believes in them. Legitimacy and trust in the state are on the verge of collapse; every decision is squeezed between preventing short-term damage and rebuilding the foundation.'},
    strengths:{tr:['Orta düzey kriz direnci (RES 6)'],en:['Moderate crisis resilience (RES 6)']},
    risks:{tr:['Meşruiyet neredeyse yok (LEG 2)','Devlet güveni çok düşük (CSR 2)','Haklar zayıf korunuyor (CR 4)'],en:['Legitimacy is almost nonexistent (LEG 2)','Trust in the state is very low (CSR 2)','Rights are weakly protected (CR 4)']}},
  {id:'divided',name:{tr:'BÖLÜNMÜŞ ADA',en:'DIVIDED ISLAND'},tag:{tr:'Haklar geniş, anlatılar çatışıyor.',en:'Rights are broad, narratives collide.'},accent:'#5B4B8A',domains:{CR:8,CSR:5,LEG:6,COH:2,JUS:4,RES:4},difficulty:4,
    detail:{tr:'Haklar kâğıt üzerinde geniş tanımlanmış, ama farklı kesimler ortak bir gerçeklik zemininde buluşamıyor. Anlatılar çatışıyor, güven aşınıyor — genişlemiş haklar tek başına toplumu bir arada tutmuyor.',en:'Rights are broadly defined on paper, but different groups can\'t meet on common ground. Narratives collide, trust erodes — expanded rights alone don\'t hold society together.'},
    strengths:{tr:['Geniş yurttaşlık hakları (CR 8)'],en:['Broad citizenship rights (CR 8)']},
    risks:{tr:['Toplumsal uyum kritik (COH 2)','Kriz direnci zayıf (RES 4)'],en:['Social cohesion is critical (COH 2)','Weak crisis resilience (RES 4)']}},
  {id:'authority',name:{tr:'OTORİTE ADASI',en:'AUTHORITY ISLAND'},tag:{tr:'Devlet sağlam, haklar gölgede.',en:'The state is solid, rights are in the shadows.'},accent:'#7B2D8E',domains:{CR:3,CSR:7,LEG:8,COH:5,JUS:3,RES:6},difficulty:3,
    detail:{tr:'Devlet güçlü, kurumlar kararlı ve halk büyük ölçüde devlete güveniyor. Ama bu güç bireysel hakların gölgede kalması pahasına elde edilmiş — sistem sağlam görünse de temeli dar.',en:'The state is strong, institutions are decisive, and the public largely trusts the state. But this strength was gained at the cost of individual rights staying in the shadows — the system looks solid, yet its foundation is narrow.'},
    strengths:{tr:['Güçlü meşruiyet (LEG 8)','Yüksek devlet güveni (CSR 7)'],en:['Strong legitimacy (LEG 8)','High trust in the state (CSR 7)']},
    risks:{tr:['Yurttaşlık hakları dar (CR 3)','Adalet algısı zayıf (JUS 3)'],en:['Narrow citizenship rights (CR 3)','Weak sense of justice (JUS 3)']}},
  {id:'adaptive',name:{tr:'UYUM ADASI',en:'ADAPTIVE ISLAND'},tag:{tr:'Dayanışma yüksek, kurumlar eski.',en:'Solidarity is high, institutions are outdated.'},accent:'#D4783A',domains:{CR:5,CSR:4,LEG:4,COH:7,JUS:5,RES:8},difficulty:2,
    detail:{tr:'Yurttaşlar arası dayanışma güçlü ve sistem şoklara karşı esnek, ama kurumlar eski usul — hızlı değişen taleplere ayak uyduramıyor. Toplum kendi kendine tutunuyor, devlet geriden geliyor.',en:'Solidarity among citizens is strong and the system is resilient to shocks, but institutions are old-fashioned — they can\'t keep up with fast-changing demands. Society holds itself together while the state lags behind.'},
    strengths:{tr:['Yüksek kriz direnci (RES 8)','Güçlü toplumsal uyum (COH 7)'],en:['High crisis resilience (RES 8)','Strong social cohesion (COH 7)']},
    risks:{tr:['Kurumsal meşruiyet zayıf (LEG 4)','Devlet güveni düşük (CSR 4)'],en:['Weak institutional legitimacy (LEG 4)','Low trust in the state (CSR 4)']}}
];

export const ARCHETYPES = [
  {name:{tr:'Hobbesçu Güvenlikçi',en:'Hobbesian Securitarian'},desc:{tr:'Düzen ve istikrarı her şeyin önüne koydun. Güvenlik için katılımdan feragat ettin.',en:'You put order and stability above everything. You traded participation for security.'},vec:{p:1.5,i:-1,j:-0.5}},
  {name:{tr:'Lockeçu Hak Savunucusu',en:'Lockean Rights Advocate'},desc:{tr:'Bireysel hakları önceliklendirdin, ama kapsayıcılığı sınırlı tuttun.',en:'You prioritized individual rights, but kept inclusiveness limited.'},vec:{p:-1,i:1.2,j:-0.8}},
  {name:{tr:'Rousseaucu Müzakereci',en:'Rousseauian Deliberator'},desc:{tr:'Katılım ve ortak iradeyi merkeze aldın; çoğunluk iradesi ön plandaydı.',en:'You centered participation and the common will; the will of the majority came first.'},vec:{p:-1.3,i:0.8,j:0.5}},
  {name:{tr:'Rawlsçı Vasi',en:'Rawlsian Guardian'},desc:{tr:'Kapsayıcılık ve tarafsız adaleti önceliklendirdin.',en:'You prioritized inclusiveness and impartial justice.'},vec:{p:0.3,i:1,j:1.5}},
  {name:{tr:'Buchanancı Pazarlıkçı',en:'Buchananite Bargainer'},desc:{tr:'Kararlarını pragmatik pazarlıkla şekillendirdin.',en:'You shaped your decisions through pragmatic bargaining.'},vec:{p:0.2,i:-0.2,j:-0.3}}
];

export const DOMAIN_DETAILS = {
  CR: {
    deep: {tr:`Bir toplumun tam üyeliğini tanımlayan hak ve yükümlülükler bütünü. Doğal hakların hukuki/insan haklarına dönüşümünü, yurttaşlığın karşılıklılığını ve zaman içinde kimlerin "tam yurttaş" sayıldığının genişleyip daralmasını kapsar. Kritik yaklaşımlar, tarihsel olarak kadınların, azınlıkların ve göçmenlerin bu tam üyelikten nasıl dışlandığını da bu alanın parçası sayar.`,
      en:`The set of rights and obligations that defines full membership in a society. It covers the transformation of natural rights into legal/human rights, the reciprocity of citizenship, and how the circle of who counts as a "full citizen" has expanded and contracted over time. Critical approaches also treat the historical exclusion of women, minorities, and migrants from full membership as part of this domain.`},
    subdomains: {tr:['Hakların korunduğuna dair farkındalık', 'Yurttaşlık haklarına aşinalık', 'Yurttaşlık sorumluluğu duygusu', 'Hakların genişlemesi ve kapsayıcılığı'],
      en:['Awareness that rights are protected', 'Familiarity with citizenship rights', 'Sense of civic responsibility', 'Expansion and inclusiveness of rights']},
    theory: {tr:`Locke (doğal haklar) ve Rousseau (ortak iyiye katılım) + Pateman/Mills'in dışlama eleştirisi`, en:`Locke (natural rights) and Rousseau (participation in the common good) + Pateman/Mills's critique of exclusion`},
    gameNote: {tr:`Göç, mobilizasyon ve dezenformasyon krizlerinde kimin "içeride" sayıldığı bu boyuta işler.`, en:`In the migration, mobilization, and disinformation crises, who counts as "inside" registers on this domain.`}
  },
  CSR: {
    deep: {tr:`Yönetenle yönetilen arasındaki çok yönlü bağ: hem somut çıktılar (kamu hizmeti, refah) hem de sembolik/duygusal bağlar (aidiyet, güven). Sözleşmenin kararlı olması için hem yukarıdan aşağı meşru bir hukuki temel hem de aşağıdan yukarı yurttaş desteği ve özdeşleşmesi gerekir.`,
      en:`The multi-dimensional bond between the governing and the governed: both concrete outputs (public services, welfare) and symbolic/emotional bonds (belonging, trust). For the contract to be stable, it needs both a legitimate legal foundation from the top down and citizen support and identification from the bottom up.`},
    subdomains: {tr:['Devlet kapasitesi ve performansı', 'Siyasi aidiyet ve kimlik', 'Devletle deneyimsel ilişki', 'Kurumların duyarlılığı algısı'],
      en:['State capacity and performance', 'Political belonging and identity', 'Lived experience with the state', 'Perceived responsiveness of institutions']},
    theory: {tr:`Siyasi yükümlülük ve meşruiyet kuramları — devletin hem sağlayıcı hem de temsilci rolü`, en:`Theories of political obligation and legitimacy — the state's dual role as provider and representative`},
    gameNote: {tr:`Çevresel şokta yerel kriz komitelerine katılım seçeneği, bu boyutun (CSR) eşiğine göre iki farklı sonuç doğurur.`, en:`In the environmental shock, the option to join local crisis committees produces two different outcomes depending on this domain's (CSR) threshold.`}
  },
  LEG: {
    deep: {tr:`İnsanların özgürlüklerinden neden vazgeçip bir siyasi düzene rıza gösterdiğinin cevabı. Hem biçimsel/hukuki temeli (yasalar, prosedürler) hem de normatif rıza temelini kapsar. Yönetim yalnızca "doğru" kabul edildiğinde meşrudur — güç kullanmakla meşru otorite arasındaki fark tam da budur.`,
      en:`The answer to why people give up some of their freedom and consent to a political order. It covers both the formal/legal foundation (laws, procedures) and the normative basis of consent. Governance is legitimate only when it is accepted as "right" — this is exactly the difference between exercising force and legitimate authority.`},
    subdomains: {tr:['Kurumlara güven', 'Prosedürel meşruiyet', 'Uyum ve rıza', 'Sistemin adil algılanması'],
      en:['Trust in institutions', 'Procedural legitimacy', 'Compliance and consent', 'Perceived fairness of the system']},
    theory: {tr:`Weberyen otorite tipolojisi + Rawlsçı ve eleştirel demokrasi kuramları`, en:`Weberian typology of authority + Rawlsian and critical democratic theory`},
    gameNote: {tr:`Kutuplaşma ve mobilizasyon krizlerinde kurumların "kabul görüp görmediği" doğrudan bu boyutu belirler.`, en:`In the polarization and mobilization crises, whether institutions are "accepted" directly determines this domain.`}
  },
  COH: {
    deep: {tr:`Devletle değil, yurttaşların birbiriyle kurduğu yatay bağların kalitesi: güven, dayanışma, farklılıklara rağmen kabul görme. Bir sözleşmenin dayanıklı olması için yalnızca devlete güven yetmez — yurttaşların birbirine güvenmesi ve farklılıklar karşısında dayanışma göstermesi gerekir.`,
      en:`The quality of the horizontal bonds citizens form with each other, not with the state: trust, solidarity, acceptance despite differences. For a contract to be durable, trust in the state alone isn't enough — citizens must trust one another and show solidarity across differences.`},
    subdomains: {tr:['Kişilerarası güven', 'Tanınma ve kapsayıcılık', 'Ayrımcılık ve eşitsizlik algısı', 'Duygusal kutuplaşma'],
      en:['Interpersonal trust', 'Recognition and inclusiveness', 'Perceived discrimination and inequality', 'Affective polarization']},
    theory: {tr:`Cemaatçi (communitarian) ve müzakereci demokrasi gelenekleri`, en:`Communitarian and deliberative-democracy traditions`},
    gameNote: {tr:`Dışlayıcı Ada gibi profillerde yüksek COH, düşük CR/JUS ile birlikte gelebilir — "sıkı ama dar" bir dayanışmayı gösterir.`, en:`In profiles like the Polarized Island, high COH can come together with low CR/JUS — indicating a "tight but narrow" solidarity.`}
  },
  JUS: {
    deep: {tr:`Sosyal sözleşme düşüncesinin normatif çekirdeği: toplumsal yapılar adalet, tarafsızlık ve eşitlik ilkeleriyle ne kadar örtüşüyor? Rawls'ın "bilgisizlik peçesi" fikrine, ayrıca feminist ve eleştirel ırk kuramlarının klasik sözleşmelere yönelttiği yapısal eşitsizlik eleştirilerine dayanır.`,
      en:`The normative core of social contract thinking: how well do social structures align with the principles of justice, impartiality, and equality? It draws on Rawls's "veil of ignorance" as well as the structural-inequality critiques that feminist and critical race theory have leveled at classical contract theory.`},
    subdomains: {tr:['Ekonomik eşitsizlik algısı', 'Liyakate inanç', 'Prosedürel adalet', 'Sistemik önyargıya yapısal eleştiri'],
      en:['Perceived economic inequality', 'Belief in meritocracy', 'Procedural justice', 'Structural critique of systemic bias']},
    theory: {tr:`Rawls (bilgisizlik peçesi, fark ilkesi) — mutual-advantage (Gauthier/Buchanan) ile impartiality (Barry/Scanlon) ayrımı`, en:`Rawls (veil of ignorance, difference principle) — the mutual-advantage (Gauthier/Buchanan) vs. impartiality (Barry/Scanlon) distinction`},
    gameNote: {tr:`Ekonomik şok ve çevresel şok krizlerinde "kim öder" sorusu bu boyutu doğrudan sınar.`, en:`In the economic shock and environmental shock crises, the question of "who pays" directly tests this domain.`}
  },
  RES: {
    deep: {tr:`Sosyal sözleşmelerin sabit değil, dinamik ve koşullara bağlı olduğunu kabul eder: toplumlar sistemik streslere, krizlere ve baskılara nasıl yanıt veriyor? Pandemi, iklim şoku, ekonomik durgunluk gibi krizlere verilen yanıtları ve popülizme karşı demokratik direnci kapsar.`,
      en:`Acknowledges that social contracts are not fixed but dynamic and context-dependent: how do societies respond to systemic stresses, crises, and pressures? It covers responses to crises such as pandemics, climate shocks, and economic downturns, as well as democratic resilience against populism.`},
    subdomains: {tr:['Kriz yanıtı değerlendirmesi', 'Demokratik direnç ve yenilikler', 'Geleceğe güven', 'Otoriter kaymaya direnç'],
      en:['Assessment of crisis response', 'Democratic resilience and innovation', 'Confidence in the future', 'Resistance to authoritarian drift']},
    theory: {tr:`Polikriz çağında sözleşmelerin uyum ve yenilenme kapasitesi üzerine güncel literatür`, en:`Recent literature on the capacity of contracts to adapt and renew in an age of polycrisis`},
    gameNote: {tr:`Direnç Puanı bu boyutla karıştırılmamalı: RES bir girdi değişken, Direnç Puanı altı boyutun bileşik dengesidir.`, en:`Don't confuse the Resilience Score with this domain: RES is one input variable, while the Resilience Score is the composite balance of all six domains.`}
  }
};

export function shuffle(a){const r=[...a];for(let i=r.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[r[i],r[j]]=[r[j],r[i]];}return r;}
export function fmt(n){return (Math.round(n*10)/10).toString();}
