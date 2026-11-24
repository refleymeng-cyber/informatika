import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/addons/geometries/RoundedBoxGeometry.js';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils.js';
import {EffectComposer} from 'three/addons/postprocessing/EffectComposer.js';
import {RenderPass} from 'three/addons/postprocessing/RenderPass.js';
import {GTAOPass} from 'three/addons/postprocessing/GTAOPass.js';
import {OutputPass} from 'three/addons/postprocessing/OutputPass.js';
/* ================== ДЕРЕКТЕР ================== */
const LESSONS=[
/* ---------- I ТОҚСАН ---------- */
{q:1,t:"Жеке қауіпсіздік және сервистік программалардың рөлі",tag:"1-сабақ",d:"Сервистік программалар және өмірлік жағдаяттар",tasks:[
 {type:"select",title:"Сипаттаманы сервистік программамен сәйкестендіріңіз",
  legend:["<b>А.</b> Архиватор","<b>Б.</b> Сақтық көшірме жасау (Backup) құралы","<b>В.</b> Антивирус","<b>Г.</b> Дискіні тазалау және оңтайландыру утилитасы"],
  opts:["А","Б","В","Г"],rows:[
  {q:"Компьютерді вирустардан, трояндардан және зиянды сілтемелерден қорғайтын программа.",a:2},
  {q:"Маңызды құжаттар мен жобалардың көшірмесін жасап, деректер жоғалғанда қалпына келтіруге көмектеседі.",a:1},
  {q:"Файлдардың көлемін кішірейтіп, бірнеше файлды бір архивке біріктіреді.",a:0},
  {q:"Дискідегі қателерді тексереді және фрагментацияны реттеп, жүйенің жұмысын тұрақтандырады.",a:3}]},
 {type:"fill",title:"Сөйлемдегі бос орынды толықтырыңыз",rows:[
  ["Жеке қауіпсіздікті сақтау үшін парольдер күрделі болуы керек және әр сайтқа ",{a:["бөлек","әртүрлі","әр түрлі","түрлі","басқа","жеке"],w:1}," пароль қолданған дұрыс."],
  ["Бейтаныс адамнан келген күдікті сілтемені ашпас бұрын ",{a:["сілтемені","ресурсты","антивируспен","сайтты","мекенжайды","адресті","антивирус"],w:1}," тексерген жөн."]]},
 {type:"select",title:"«Өмірлік жағдаяттарды талдау»",desc:"Әр жағдаятты оқып, қауіпті және оны болдырмайтын сервистік құралды таңдаңыз.",
  legend:["<b>Жағдаят А:</b> Арман жоба жазып отырғанда жарық сөніп, сақталмаған бөлігі жоғалды, флешкадағы файл ашылмай қалды.","<b>Жағдаят Б:</b> Аружанға «Тегін ойын/монета ал! Сілтемеге өт» деген хабарлама келді. Сайтқа кірген соң күдікті терезелер ашыла бастады.","<b>Жағдаят В:</b> Компьютердің жады толып, баяу жұмыс істей бастады; ескі уақытша файлдар мен қайталанған құжаттар көбейіп кеткен."],
  rows:[
  {q:"А — қауіп",o:["Деректердің жоғалуы","Фишинг, зиянды программа","Жүйенің баяулауы, жадының толуы"],a:0},
  {q:"А — шешімі / құрал",o:["Сақтық көшірме (Backup), автосақтау","Антивирус, күдікті сілтемені ашпау","Дискіні тазалау утилитасы"],a:0},
  {q:"Б — қауіп",o:["Деректердің жоғалуы","Фишинг, зиянды программа","Жүйенің баяулауы, жадының толуы"],a:1},
  {q:"Б — шешімі / құрал",o:["Сақтық көшірме (Backup), автосақтау","Антивирус, күдікті сілтемені ашпау","Дискіні тазалау утилитасы"],a:1},
  {q:"В — қауіп",o:["Деректердің жоғалуы","Фишинг, зиянды программа","Жүйенің баяулауы, жадының толуы"],a:2},
  {q:"В — шешімі / құрал",o:["Сақтық көшірме (Backup), автосақтау","Антивирус, күдікті сілтемені ашпау","Дискіні тазалау утилитасы"],a:2}]}
]},
{q:1,t:"Жеке қауіпсіздік және сервистік программалардың рөлі",tag:"2-сабақ",d:"Жүйелеу, бағалау және шығармашылық",tasks:[
 {type:"tf",title:"«Дұрыс / Қате» белгісін қойыңыз",desc:"Пікір қате болса, неліктен қате екенін бір сөйлеммен түсіндіріңіз.",rows:[
  {q:"Антивирус базасын жаңартпай қойса да, ол жаңа вирустардың барлығын 100% табады.",a:false,fix:"Жаңа вирустарды анықтау үшін антивирус базасы үнемі жаңартылып отыруы керек."},
  {q:"Архиватор файлдарды жинақтауға көмектеседі, бірақ ақпараттық қауіпсіздікті толық алмастыра алмайды.",a:true},
  {q:"Жеке аккаунтта екіфакторлы аутентификацияны (2FA) қосу қауіпсіздікті арттырады.",a:true}]},
 {type:"order",free:1,title:"Ережелерді маңыздылығы бойынша нөмірлеңіз",desc:"1 — ең алдымен орындалатын әрекет. Таңдауыңызды төменде қысқаша негіздеңіз.",rows:[
  {q:"Маңызды файлдардың сақтық көшірмесін жасау."},{q:"Антивирус пен операциялық жүйені жаңарту."},{q:"Күмәнді файл мен сілтемені ашпау."}],
  fields:["Негіздеме"],sample:"<b>Үлгі:</b> 1 — күмәнді файл мен сілтемені ашпау (қауіптің алдын алады); 2 — антивирус пен ОЖ-ні жаңарту (жаңа қауіптерден қорғайды); 3 — сақтық көшірме жасау (бәрібір бірдеңе болса, деректер қалпына келеді). Басқа реттілік те дұрыс негізделсе қабылданады."},
 {type:"open",title:"«Қауіпсіз цифрлық кеңістік ережесі» — жаднама",desc:"7-сынып оқушыларына арналған 4 қағидадан тұратын жаднама құрастырыңыз. Әр қағидада қысқа ереже және ол қандай сервистік программамен немесе әрекетпен байланысты екені көрсетілсін.",
  fields:["1-қағида (үлгі: Бөтен құрылғыда аккаунтыңды ашық қалдырма, шығар алдында жүйеден шық — Log out)","2-қағида","3-қағида","4-қағида"],
  sample:"<b>Үлгі жаднама:</b><br>1. Аккаунттан шығуды ұмытпа — Log out.<br>2. Әр сайтқа бөлек күрделі пароль қой, 2FA қос — пароль менеджері.<br>3. Күдікті сілтеме мен файлды ашпа, тексер — антивирус.<br>4. Маңызды файлдардың көшірмесін сақта — Backup құралы."}
]},
{q:1,t:"Ақпараттың өлшем бірліктері",tag:"3–4-сабақ",d:"Бірліктер, есептеу, салыстыру, қатені түзету",tasks:[
 {type:"order",title:"Бірліктерді өсу ретімен нөмірлеңіз",desc:"1 — ең кішісі, 6 — ең үлкені.",rows:[
  {q:"Мегабайт (МБ)",a:4},{q:"Бит",a:1},{q:"Терабайт (ТБ)",a:6},{q:"Килобайт (КБ)",a:3},{q:"Байт",a:2},{q:"Гигабайт (ГБ)",a:5}]},
 {type:"fill",title:"Бос орынды толтырыңыз",rows:[
  ["Бір символды кодтауға (ASCII бойынша) әдетте ",{a:["1"]}," байт немесе ",{a:["8"]}," бит қажет."],
  ["1 КБ ішінде 2 дәрежесі түрінде жазғанда ",{a:["2^10","1024","210"]}," байт бар."],
  ["4 ГБ = ",{a:["4096"]}," МБ"],
  ["6144 КБ = ",{a:["6"]}," МБ"]]},
 {type:"fill",title:"«Есепте және салыстыр» — есептеңіз",rows:[
  ["Әрқайсысы 512 КБ болатын 6 сурет файлы бар. Барлық суреттің көлемі ",{a:["3"]}," МБ"],
  ["Флешканың бос көлемі 2 ГБ. Әрқайсысы 256 МБ болатын ",{a:["8"]}," бейнефайл сыяды."],
  ["Мәтіндік файлға 2048 символ енгізілді (әр символ 1 байт). Файл көлемі ",{a:["2"]}," КБ"]]},
 {type:"select",title:"Екі шаманы салыстырыңыз",opts:["<","=",">"],rows:[
  {q:"1024 байт  ___  1 КБ",a:1},{q:"3 ГБ  ___  2500 МБ",a:2},{q:"32 бит  ___  5 байт",a:0},{q:"1 ТБ  ___  1024 ГБ",a:1}]},
 {type:"fill",title:"Жағдаятты талдаңыз",desc:"16 оқушының әрқайсысы жобалық жұмыс файлын жіберді. Әр файлдың орташа көлемі 128 МБ. Мұғалімнің бұлттық қоймасында 3 ГБ бос орын бар.",rows:[
  ["Барлық файлдардың жалпы көлемі: ",{a:["2048"]}," МБ = ",{a:["2"]}," ГБ"],
  ["Барлық файл сыя ма? (иә / жоқ) ",{a:["иә","ия","сыяды"]},", бос орын ",{a:["1"]}," ГБ қалады."]]},
 {type:"open",title:"Қатені табыңыз",desc:"Оқушы: «2 КБ дегеніміз 2 × 1000 = 2000 байт» деп жазды.",fields:["Оқушы қандай қате жіберді?","Дұрыс есептеу жолы"],
  sample:"<b>Жауап:</b> килобайт пен байт арасында 1000 емес, 1024 қолданылады. Дұрысы: 2 × 1024 = 2048 байт."}
]},
{q:1,t:"Ақпаратты өлшеу",tag:"5-сабақ",d:"Мәтіндегі ақпарат көлемі, түрлендіру, тасығышты таңдау",tasks:[
 {type:"fill",title:"Мәтіндегі ақпарат көлемі",desc:"Бір символ 1 байт (8 бит) орын алады деп есептеңіз. Бос орын мен тыныс белгілері де символ болып саналады.",rows:[
  ["«Ақпаратты өлшеу — қызық!» хабарламасында ",{a:["24"]}," символ; көлемі ",{a:["24"]}," байт = ",{a:["192"]}," бит."],
  ["Кітап бетінде 32 жол, әр жолда 64 символ: ",{a:["2048"]}," байт = ",{a:["2"]}," КБ"],
  ["4 беттік реферат, әр бетте 1024 символ: ",{a:["4"]}," КБ"]]},
 {type:"fill",title:"Өлшем бірліктерін түрлендір",rows:[
  ["24 бит = ",{a:["3"]}," байт"],["64 байт = ",{a:["512"]}," бит"],["5 Кбайт = ",{a:["5120"]}," байт"],
  ["3 Мбайт = ",{a:["3072"]}," Кбайт"],["2 Гбайт = ",{a:["2048"]}," Мбайт"],["4096 байт = ",{a:["4"]}," Кбайт"]]},
 {type:"fill",title:"«Ақпарат тасығышты таңдау»",desc:"Алия сабақ материалдарын сақтауы керек. 1-жиын: 600 МБ бейнедәріс және 424 МБ суреттер архиві. 2-жиын: қосымша 1 ГБ оқу бағдарламасы.",rows:[
  ["1-жиынның көлемі: ",{a:["1024"]}," МБ = ",{a:["1"]}," ГБ"],
  ["Екі жиын бірігіп ",{a:["2"]}," ГБ орын алады."]]},
 {type:"select",title:"Алияға қай флешка ең қолайлы?",opts:["1 ГБ","2 ГБ","4 ГБ"],rows:[{q:"Флешка көлемі",a:[1,2]}],
  fields:["Неліктен?"],sample:"<b>Жауап:</b> 2 ГБ — файлдардың өзіне дәл келеді; 4 ГБ — бос орын қалады (бұл да дұрыс). 1 ГБ жетпейді."}
]},
{q:1,t:"Ақпаратты өлшеу",tag:"6-сабақ",d:"Дұрыс па, бұрыс па? «Кім жылдам?»",tasks:[
 {type:"tf",title:"Дұрыс немесе бұрыс?",rows:[
  {q:"1 байт 8 битке тең.",a:true},{q:"1 Кбайт 100 байтқа тең.",a:false},{q:"1 Мбайт 1024 Кбайтқа тең.",a:true},
  {q:"Ақпараттың ең кіші өлшем бірлігі — бит.",a:true},{q:"1 Гбайт 1024 Мбайтқа тең.",a:true}]},
 {type:"fill",title:"«Кім жылдам?» — кестені толтыр",rows:[
  ["8 бит = 1 байт (үлгі)"],["16 бит = ",{a:["2"]}," байт"],["32 бит = ",{a:["4"]}," байт"],["64 бит = ",{a:["8"]}," байт"],
  ["128 бит = ",{a:["16"]}," байт"],["256 бит = ",{a:["32"]}," байт"],["512 бит = ",{a:["64"]}," байт"],["1024 бит = ",{a:["128"]}," байт"]]}
]},
{q:1,t:"Мәтіндік ақпаратты және монохромды кескіндерді кодтау (ASCII, Unicode)",tag:"7-сабақ",d:"Терминдер, тұжырымдар, ASCII кодтары",tasks:[
 {type:"select",title:"Терминдерді анықтамаларымен сәйкестендір",
  legend:["<b>A.</b> Әртүрлі тілдердің символдарын кодтайтын жүйе","<b>B.</b> Ақ-қара түсті екі мән арқылы кескінді көрсету","<b>C.</b> Символдарды кодтаудың бастапқы стандарты","<b>D.</b> Ақпараттың ең кіші өлшем бірлігі"],
  opts:["A","B","C","D"],rows:[{q:"ASCII",a:2},{q:"Unicode",a:0},{q:"Монохромды кескін",a:1},{q:"Бит",a:3}]},
 {type:"tf",title:"Тұжырымдардың дұрыстығын анықта",rows:[
  {q:"ASCII кодтау жүйесі символдарды кодтау үшін қолданылады.",a:true},{q:"Unicode тек ағылшын әріптерін кодтайды.",a:false},
  {q:"Монохромды кескін екі түстен тұрады.",a:true},{q:"1 пиксельді кодтау үшін 1 бит жеткілікті.",a:true},{q:"Unicode қазақ әріптерін кодтай алмайды.",a:false}]},
 {type:"fill",title:"Сөздерді ASCII кодтары арқылы кодта",desc:"Үлкен латын әріптері: A=65, B=66, C=67 … Кодтарды бос орын немесе үтір арқылы жазыңыз.",rows:[
  ["CAT → ",{a:["676584"],w:1}],["DOG → ",{a:["687971"],w:1}],["BAD → ",{a:["666568"],w:1}],["CODE → ",{a:["67796869"],w:1}],["DATA → ",{a:["68658465"],w:1}]]},
 {type:"tf",title:"Қатені түзет",desc:"Тұжырым дұрыс па? Қате болса, дұрыс нұсқасын жаз.",rows:[
  {q:"ASCII барлық әлем тілдерінің әріптерін толық кодтайды.",a:false,fix:"ASCII барлық тілдерді толық кодтамайды."},
  {q:"Unicode тек сандарды кодтау үшін қолданылады.",a:false,fix:"Unicode мәтіндік символдарды кодтайды."},
  {q:"Монохромды кескінді кодтауға 1 пиксель үшін 8 бит қажет.",a:false,fix:"Монохромды кескін үшін 1 пиксельге 1 бит жеткілікті."},
  {q:"Ақ пиксельді 1, қара пиксельді 0 деп белгілеуге болмайды.",a:false,fix:"Ақ пен қараны 0 және 1 арқылы кодтауға болады (қай мәннің қай түске сәйкес келетінін алдын ала келісу қажет)."},
  {q:"8 бит 1 байтқа тең.",a:true}]}
]},
{q:1,t:"Мәтіндік ақпаратты және монохромды кескіндерді кодтау (ASCII, Unicode)",tag:"8-сабақ",d:"Ақпарат көлемін есептеу және тест",tasks:[
 {type:"fill",title:"Ақпарат көлемін есепте",rows:[
  ["А) 12×12 монохромды суретте ",{a:["144"]}," пиксель; көлемі ",{a:["144"]}," бит."],
  ["Ә) 64×64 пиксель кескінді кодтауға ",{a:["512"]}," байт қажет."],
  ["Б) 3200 бит = ",{a:["400"]}," байт"],
  ["В) 2 Кбайт жадыға 1 бит/пиксельмен ",{a:["16384"]}," пиксель сақтауға болады."]]},
 {type:"quiz",title:"«ASCII ме, Unicode па?» — тест",qs:[
  {q:"ASCII кодтау жүйесінің негізгі мақсаты:",o:["Суретті өңдеу","Символдарды кодтау","Дыбысты жазу"],a:1},
  {q:"Қазақ әріптерін кодтау үшін қай жүйе қолайлы?",o:["Unicode","Тек ASCII","JPEG"],a:0},
  {q:"Монохромды кескіннің бір пикселі:",o:["2 байт","1 бит","16 бит"],a:1},
  {q:"1 байт неше биттен тұрады?",o:["4","8","16"],a:1},
  {q:"Unicode не үшін қажет?",o:["Әртүрлі тілдердің символдарын кодтау үшін","Тек сурет салу үшін","Тек дыбыс сақтау үшін"],a:0}]}
]},
/* ---------- II ТОҚСАН (3D) ---------- */
{q:2,t:"Үш өлшемді графика редакторы",tag:"1-сабақ · 3D",d:"2D мен 3D-ны ажырату, 3D терминдері, компьютерлік модельдің қолданылуы",tasks:[
 {type:"select",title:"«3D немесе 2D?» — ажырат",desc:"Сахнаны айналдырып, әр нысанды бүйірінен қараңыз: жалпақ па, көлемді ме? Жолды бассаңыз, нысан белгіленеді.",
  scene:{b:["shelf"],link:"focus",h:380},opts:["2D","3D"],rows:[
  {q:"Фотосурет",a:0},{q:"Үш өлшемді үй моделі",a:1},{q:"Компьютердегі шеңбер",a:0},{q:"3D көлік моделі",a:1},{q:"Қағаздағы сурет",a:0},{q:"Blender-де жасалған робот",a:1}]},
 {type:"select",title:"3D графика терминдерін сәйкестендір",desc:"3D студияда модель, камера және жарық көз алдыңызда. «Рендер» батырмасын басып, камерадан түсірілген көріністі көріңіз.",
  scene:{b:["studio"],h:380},
  legend:["<b>A.</b> Нысанды жарықтандыруға арналған элемент","<b>B.</b> Үш өлшемді кеңістіктегі объект","<b>C.</b> Нысанның виртуалды көрінісі","<b>D.</b> Модельді көруге және кадрға түсіруге арналған құрал","<b>E.</b> Дайын 3D көріністі кескінге айналдыру процесі"],
  opts:["A","B","C","D","E"],rows:[{q:"3D графика",a:1},{q:"Модель",a:2},{q:"Камера",a:3},{q:"Жарық",a:0},{q:"Рендеринг",a:4}]},
 {type:"select",title:"Компьютерлік модель қай жерде қолданылады?",desc:"Әр 3D модельді айналдырып қараңыз (‹ › немесе жолды басыңыз) және модельді қолдану мақсатын таңдаңыз.",
  scene:{b:["school","heart","robotGame","gear","room"],link:"carousel",h:360},
  opts:["Ғимаратты алдын ала жобалау","Адам ағзасын зерттеу","Кейіпкер мен виртуалды орта жасау","Бөлшектерді жобалау және сынау","Интерьерді алдын ала көру"],rows:[
  {q:"Сәулетші жаңа мектеп жобасын жасап жатыр.",a:0},{q:"Дәрігер адам жүрегінің құрылысын түсіндіреді.",a:1},
  {q:"Ойын жасаушы жаңа кейіпкер құрастырады.",a:2},{q:"Инженер автокөліктің бөлшегін жобалайды.",a:3},{q:"Дизайнер бөлменің интерьерін жасайды.",a:4}]}
]},
{q:2,t:"Нысандардың 3D модельдері",tag:"2-сабақ · 3D",d:"3D редакторлар, модельдің артықшылығы, тест",tasks:[
 {type:"select",title:"«Қай редакторды таңдаймын?»",desc:"Үш редактордың стилінде жасалған жұмыстарды қараңыз да, әр жұмысқа сәйкес бағдарламаны таңдаңыз.",
  scene:{b:["edBlender","edSketch","edTinker"],link:"carousel",h:340},opts:["Blender","SketchUp","Tinkercad"],rows:[
  {q:"3D модельдеу және анимация жасау",a:0},{q:"Үйдің қарапайым моделін құрастыру",a:1},{q:"Онлайн түрде 3D объект жасау",a:2}]},
 {type:"open",title:"«Артықшылық пен кемшілік»",desc:"Виртуалды соқтығысу сынағын жүргізіп көріңіз: көлік бүлінбейді, түсін бір сәтте өзгертуге болады. Содан кейін компьютерлік модельдерді қолданудың 3 артықшылығы мен 2 кемшілігін жазыңыз.",
  scene:{b:["crash"],h:320},
  fields:["Артықшылығы 1","Артықшылығы 2","Артықшылығы 3","Кемшілігі 1","Кемшілігі 2"],
  sample:"<b>Артықшылықтары:</b> нақты нысанды бүлдірмей қауіпсіз сынауға болады; уақыт пен материал үнемделеді; модельді жылдам өзгертуге және кез келген бұрыштан көруге болады.<br><b>Кемшіліктері:</b> қуатты компьютер мен арнайы бағдарлама қажет; модель нақты нысанның барлық қасиетін дәл бере бермейді."},
 {type:"quiz",title:"Тест",desc:"4-сұраққа жауап беру үшін 3D осьтерді айналдырып қараңыз (Blender-дегідей, Z осі жоғары).",scene:{b:["axes"],h:330},qs:[
  {q:"Үш өлшемді графикада неше өлшем бар?",o:["1","2","3"],a:2},
  {q:"3D модель жасауға арналған бағдарлама:",o:["Paint","Blender","Word"],a:1},
  {q:"3D модель дегеніміз не?",o:["Дыбыстық файл","Үш өлшемді объектінің компьютерлік көрінісі","Мәтіндік құжат"],a:1},
  {q:"3D модельдеуде биіктікті қай ось көрсетеді?",o:["X","Y","Z"],a:2},
  {q:"Компьютерлік модель қай салада қолданылады?",o:["Медицина","Архитектура","Ойын жасау","Барлығы дұрыс"],a:3}]}
]},
{q:2,t:"Нысандардың 3D модельдері",tag:"3-сабақ · 3D",d:"Модельді геометриялық фигуралардан құрастыру",tasks:[
 {type:"checks",title:"Нысан қандай фигуралардан құрастырылған?",desc:"Модельді айналдырыңыз, «Бөлшектеу» батырмасымен бөліп қараңыз. Әр нысанға қолданылған фигураларды белгілеңіз.",
  scene:{b:["chair","house","car","apple"],link:"carousel",h:370},chips:["Куб","Параллелепипед","Цилиндр","Призма","Сфера","Конус"],rows:[
  {q:"Орындық",req:["Параллелепипед","Цилиндр"],opt:["Куб"]},
  {q:"Үй",req:["Куб","Призма"],opt:["Параллелепипед"]},
  {q:"Автокөлік",req:["Параллелепипед","Цилиндр"],opt:["Куб"]},
  {q:"Алма",req:["Сфера"],opt:["Цилиндр"]}]},
 {type:"tf",title:"Дұрыс немесе бұрыс?",desc:"Кубты айналдырып, түсін ауыстырып, тұжырымдарды тексеріңіз.",scene:{b:["cubeLab"],h:320},rows:[
  {q:"3D модельдің ұзындығы, ені және биіктігі болады.",a:true},{q:"3D модельді тек алдынан көруге болады.",a:false},
  {q:"Куб — үш өлшемді геометриялық нысан.",a:true},{q:"3D модельде нысанның түсін өзгертуге болады.",a:true},
  {q:"Компьютерлік модельдер тек ойын жасау үшін қолданылады.",a:false}]},
 {type:"select",title:"Компьютерлік модельдерді қолдану",desc:"Әр 3D модельді қарап, ол қай салада қолданылатынын таңдаңыз. Мысалы: ғимарат моделі — сәулет және құрылыс саласында.",
  scene:{b:["tower","skeleton","plane","robotGame"],link:"carousel",h:370},
  opts:["Сәулет, құрылыс","Медицина, биология","Авиация, инженерия","Компьютерлік ойын, анимация"],rows:[
  {q:"Ғимарат",a:0},{q:"Адам қаңқасы",a:1},{q:"Ұшақ",a:2},{q:"Ойын кейіпкері",a:3}]}
]},
{q:2,t:"3D анимация",tag:"4-сабақ · 3D",d:"Кадр, қозғалыс, анимацияның қолданылуы",tasks:[
 {type:"select",title:"Сәйкестендір",desc:"Анимацияны ойнатып, жүгірткімен кадрларды бір-бірлеп қараңыз. Мөлдір шарлар — негізгі кадрлар.",scene:{b:["keyframes"],h:330},
  legend:["<b>A.</b> Анимациядағы бір бейне","<b>B.</b> Объектінің қозғалысын компьютерде көрсету","<b>C.</b> Үш өлшемді объект","<b>D.</b> Объектінің орнын немесе бағытын өзгерту"],
  opts:["A","B","C","D"],rows:[{q:"3D анимация",a:1},{q:"Кадр",a:0},{q:"Модель",a:2},{q:"Қозғалыс",a:3}]},
 {type:"tf",title:"Дұрыс немесе бұрыс",rows:[
  {q:"3D анимацияда объектілер қозғала алады.",a:true},{q:"Анимация жасау үшін кадрлар қолданылмайды.",a:false},
  {q:"3D анимация мультфильм жасауда қолданылады.",a:true},{q:"Анимацияда объектінің орнын өзгертуге болады.",a:true},
  {q:"3D анимация тек мәтін жазуға арналған.",a:false}]},
 {type:"select",title:"Анимацияның қолданылу саласын анықта",desc:"Төрт 3D анимацияны қараңыз да, әрқайсысы қай салада қолданылатынын таңдаңыз.",
  scene:{b:["anCartoon","anGame","anMed","anArch"],link:"carousel",h:360},opts:["Мультфильм","Компьютерлік ойын","Медицина","Архитектура"],rows:[
  {q:"1-анимация",a:0},{q:"2-анимация",a:1},{q:"3-анимация",a:2},{q:"4-анимация",a:3}]}
]}
];

/* ================== КӨМЕКШІЛЕР ================== */
const $=(s,r=document)=>r.querySelector(s);
const el=(tag,cls,html)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const norm=s=>String(s).toLowerCase().replace(/ё/g,"е").replace(/[\s.,;:!?«»"'()–—\-]/g,"");
function okAns(input,acc,loose){const n=norm(input);if(!n)return false;
 return acc.some(a=>{const x=norm(a);if(n===x)return true;
  if(/^[0-9^]+$/.test(x)){return n.replace(/[^0-9^]/g,"")===x}
  return loose&&n.includes(x)})}
const ACC={1:["#2f5bea","#e8eeff"],2:["#7a3cf0","#f1eaff"]};

/* ================== ТАПСЫРМА РЕНДЕРІ ================== */
let viewers=[];
const TYPE={select:"Сәйкестендіру",fill:"Толықтыру",tf:"Дұрыс / Қате",order:"Ретпен қою",quiz:"Тест",open:"Ашық жауап",checks:"Фигураларды белгілеу"};
const PROG={};
function renderTask(t,i,li){
 const card=el("article","task");
 card.appendChild(el("header","task-head",`<span class="tnum">${String(i+1).padStart(2,"0")}</span><div><div class="ttype"><span class="eyebrow">${TYPE[t.type]}</span>${t.scene?'<span class="b3d">3D</span>':""}</div><h3>${t.title}</h3>${t.desc?`<p class="desc">${t.desc}</p>`:""}</div>`));
 const wrap=el("div","task-body");card.appendChild(wrap);
 const sceneHost=t.scene?el("div"):null; if(sceneHost)wrap.appendChild(sceneHost);
 if(t.legend){const lg=el("div","legend");t.legend.forEach(x=>lg.appendChild(el("div",null,x)));wrap.appendChild(lg)}
 const body=el("div","rows");wrap.appendChild(body);
 const api=BUILD[t.type](t,body);
 let fieldsEls=[];
 if(t.fields){const fw=el("div","fields");t.fields.forEach((f,k)=>{const d=el("div","field");const id=`f-${li}-${i}-${k}`;const lb=el("label",null,f);lb.htmlFor=id;d.appendChild(lb);const ta=el("textarea");ta.id=id;d.appendChild(ta);fieldsEls.push(ta);fw.appendChild(d)});wrap.appendChild(fw)}
 if(t.sample)wrap.appendChild(el("div","sample",t.sample));
 const foot=el("div","foot");const score=el("span","score");score.setAttribute("aria-live","polite");
 const graded=api.check&&!t.free;
 if(graded){const b=el("button","btn","Тексеру");b.onclick=()=>{const[r,n]=api.check();score.textContent=r===n?`Бәрі дұрыс · ${r} / ${n}`:`Дұрыс: ${r} / ${n}`;score.className="score show "+(r===n?"full":"part");PROG[li+"-"+i]=r===n?"full":"part";SCORE[li+"-"+i]=r;saveProg();refreshProgress()};foot.appendChild(b)}
 const rv=el("button","btn ghost",graded?"Жауабын көрсету":"Үлгі жауап");rv.onclick=()=>{card.classList.toggle("reveal");rv.textContent=card.classList.contains("reveal")?"Жауабын жасыру":(graded?"Жауабын көрсету":"Үлгі жауап")};foot.appendChild(rv);
 const rs=el("button","btn plain","Тазалау");rs.onclick=()=>{api.reset&&api.reset();fieldsEls.forEach(f=>f.value="");score.className="score";card.classList.remove("reveal");rv.textContent=graded?"Жауабын көрсету":"Үлгі жауап";delete PROG[li+"-"+i];delete SCORE[li+"-"+i];saveProg();refreshProgress()};foot.appendChild(rs);
 foot.appendChild(score);card.appendChild(foot);
 if(t.scene){
  const rowsEls=[...body.children];
  let v;
  try{
   v=new Viewer(sceneHost,{builders:t.scene.b,h:t.scene.h,link:t.scene.link,onIndex:k=>{rowsEls.forEach((r,j)=>r.classList.toggle("cur",j===k&&!!t.scene.link))}});
   viewers.push(v);
   if(t.scene.link)rowsEls.forEach((r,j)=>{r.classList.add("link");r.addEventListener("click",e=>{v.select(j);rowsEls.forEach((x,m)=>x.classList.toggle("cur",m===j))})});
  }catch(e){console.log(e);sceneHost.appendChild(el("div","err3d","3D сахна ашылмады. Бетті жаңартып көріңіз."))}
 }
 return card;
}
const BUILD={
 select(t,body){const items=t.rows.map((r,k)=>{const row=el("div","row");row.appendChild(el("div","q",`<span class="num">${k+1}.</span> ${r.q}`));
   const s=el("select");const opts=r.o||t.opts;s.appendChild(el("option",null,"Таңдаңыз"));s.firstChild.value="";
   opts.forEach((o,j)=>{const op=el("option");op.value=j;op.textContent=o;s.appendChild(op)});s.addEventListener("click",e=>e.stopPropagation());row.appendChild(s);
   const aa=[].concat(r.a);row.appendChild(el("div","ans",aa.map(j=>opts[j]).join(" / ")));body.appendChild(row);return{row,s,aa}});
  return{check(){let c=0;items.forEach(({row,s,aa})=>{const ok=s.value!==""&&aa.includes(+s.value);c+=ok;row.classList.toggle("good",ok);row.classList.toggle("badr",!ok)});return[c,items.length]},
   reset(){items.forEach(({row,s})=>{s.value="";row.classList.remove("good","badr")})}}},
 fill(t,body){const items=[];t.rows.forEach(parts=>{const row=el("div","row");const q=el("div","q");const blanks=[];
   parts.forEach(p=>{if(typeof p==="string")q.appendChild(document.createTextNode(p));else{const inp=el("input","blank"+(p.w?" w":""));inp.type="text";inp.autocomplete="off";q.appendChild(inp);blanks.push({inp,p})}});
   row.appendChild(q);if(blanks.length)row.appendChild(el("div","ans",blanks.map(b=>b.p.a[0]==="676584"?"67, 65, 84":fmtAns(b.p.a[0])).join(" · ")));body.appendChild(row);if(blanks.length)items.push({row,blanks})});
  return{check(){let c=0;items.forEach(({row,blanks})=>{const ok=blanks.every(b=>okAns(b.inp.value,b.p.a,b.p.w));c+=ok;row.classList.toggle("good",ok);row.classList.toggle("badr",!ok)});return[c,items.length]},
   reset(){items.forEach(({row,blanks})=>{blanks.forEach(b=>b.inp.value="");row.classList.remove("good","badr")})}}},
 tf(t,body){const items=t.rows.map((r,k)=>{const row=el("div","row");row.appendChild(el("div","q",`<span class="num">${k+1}.</span> ${r.q}`));
   const g=el("div","tf");const bD=el("button",null,"Дұрыс"),bB=el("button",null,"Қате");g.append(bD,bB);row.appendChild(g);
   const fix=el("textarea","fix");fix.placeholder="Неліктен қате? Дұрыс нұсқасын жазыңыз…";row.appendChild(fix);
   const st={v:null};const set=v=>{st.v=v;bD.classList.toggle("sel",v===true);bB.classList.toggle("sel",v===false);fix.classList.toggle("show",v===false)};
   bD.onclick=e=>{e.stopPropagation();set(true)};bB.onclick=e=>{e.stopPropagation();set(false)};fix.addEventListener("click",e=>e.stopPropagation());
   row.appendChild(el("div","ans",(r.a?"Дұрыс":"Қате")+(r.fix?" — "+r.fix:"")));body.appendChild(row);return{row,st,set,r,fix}});
  return{check(){let c=0;items.forEach(({row,st,r})=>{const ok=st.v===r.a;c+=ok;row.classList.toggle("good",ok);row.classList.toggle("badr",!ok)});return[c,items.length]},
   reset(){items.forEach(it=>{it.set(null);it.fix.value="";it.row.classList.remove("good","badr")})}}},
 order(t,body){const n=t.rows.length;const items=t.rows.map(r=>{const row=el("div","row");const s=el("select");s.appendChild(el("option",null,"№"));s.firstChild.value="";
   for(let k=1;k<=n;k++){const o=el("option",null,k);o.value=k;s.appendChild(o)}row.appendChild(s);row.appendChild(el("div","q",r.q));
   if(r.a)row.appendChild(el("div","ans",r.a));body.appendChild(row);return{row,s,r}});
  return{check:t.free?null:function(){let c=0;items.forEach(({row,s,r})=>{const ok=+s.value===r.a;c+=ok;row.classList.toggle("good",ok);row.classList.toggle("badr",!ok)});return[c,items.length]},
   reset(){items.forEach(({row,s})=>{s.value="";row.classList.remove("good","badr")})}}},
 quiz(t,body){const items=t.qs.map((q,k)=>{const box=el("div","mcq");box.appendChild(el("div",null,`<b>${k+1}.</b> ${q.q}`));const os=el("div","opts");const st={v:null};
   const bs=q.o.map((o,j)=>{const b=el("button","opt",`${"ABCD"[j]}) ${o}`);b.onclick=()=>{st.v=j;bs.forEach((x,m)=>x.classList.toggle("sel",m===j))};os.appendChild(b);return b});
   box.appendChild(os);box.appendChild(el("div","ans","ABCD"[q.a]+") "+q.o[q.a]));body.appendChild(box);return{box,st,bs,q}});
  return{check(){let c=0;items.forEach(({box,st,q})=>{const ok=st.v===q.a;c+=ok;box.classList.toggle("good",ok);box.classList.toggle("badr",!ok)});return[c,items.length]},
   reset(){items.forEach(({box,st,bs})=>{st.v=null;bs.forEach(b=>b.classList.remove("sel"));box.classList.remove("good","badr")})}}},
 checks(t,body){const items=t.rows.map((r,k)=>{const row=el("div","row");row.appendChild(el("div","q",`<span class="num">${k+1}.</span> <b>${r.q}</b>`));const cw=el("div","chips");const sel=new Set();
   const cs=t.chips.map(c=>{const b=el("button","chip",c);b.onclick=e=>{e.stopPropagation();sel.has(c)?sel.delete(c):sel.add(c);b.classList.toggle("sel")};cw.appendChild(b);return b});
   row.appendChild(cw);row.appendChild(el("div","ans",r.req.join(", ")+(r.opt.length?" (+ "+r.opt.join(", ")+" — болуы мүмкін)":"")));body.appendChild(row);return{row,sel,cs,r}});
  return{check(){let c=0;items.forEach(({row,sel,r})=>{const ok=r.req.every(x=>sel.has(x))&&[...sel].every(x=>r.req.includes(x)||r.opt.includes(x));c+=ok;row.classList.toggle("good",ok);row.classList.toggle("badr",!ok)});return[c,items.length]},
   reset(){items.forEach(({row,sel,cs})=>{sel.clear();cs.forEach(b=>b.classList.remove("sel"));row.classList.remove("good","badr")})}}},
 open(t,body){body.remove();return{}}
};
function fmtAns(a){if(a==="2^10")return"2¹⁰ (1024)";if(/^\d{5,}$/.test(a)&&a.length%2===0&&+a>70000){return a.match(/.{2}/g).join(", ")}if(a==="16384")return"16 384";return a}

/* ================== 3D ҚОЗҒАЛТҚЫШ (three.js r160) ================== */
const V3=(x=0,y=0,z=0)=>new THREE.Vector3(x,y,z);
const MAT=(c,o)=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:.5,metalness:.05,clearcoat:.15,clearcoatRoughness:.4},o||{}));
/* сапалы рендер: MSAA + GTAO (көлеңкелі бұрыштар) — қуатты құрылғыларда */
const HQ=!matchMedia("(pointer: coarse)").matches&&(navigator.hardwareConcurrency||4)>=4;
function makeComposer(r,camera,ao){if(!HQ)return null;try{const rt=new THREE.WebGLRenderTarget(1,1,{type:THREE.HalfFloatType,samples:4});const c=new EffectComposer(r,rt);const rp=new RenderPass(null,camera);c.addPass(rp);let g=null;
 if(ao){g=new GTAOPass(null,camera,1,1);g.updateGtaoMaterial({radius:ao.radius||.4,distanceExponent:1,thickness:1,scale:1,samples:16,distanceFallOff:1});g.updatePdMaterial({lumaPhi:10,depthPhi:2,normalPhi:3,radius:6,rings:2,samples:16});g.blendIntensity=ao.k||.9;c.addPass(g)}
 c.addPass(new OutputPass());return{c,setScene(s){rp.scene=s;if(g)g.scene=s},setSize(w,h){c.setPixelRatio(Math.min(devicePixelRatio,1.5));c.setSize(w,h)}}}catch(e){console.warn(e);return null}}
function gradBg(top,bottom){const c=document.createElement("canvas");c.width=4;c.height=512;const x=c.getContext("2d");const g=x.createLinearGradient(0,0,0,512);g.addColorStop(0,top);g.addColorStop(.62,bottom);g.addColorStop(1,bottom);x.fillStyle=g;x.fillRect(0,0,4,512);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t}
const groundAlpha=(()=>{const c=document.createElement("canvas");c.width=c.height=512;const x=c.getContext("2d");const g=x.createRadialGradient(256,256,40,256,256,256);g.addColorStop(0,"#fff");g.addColorStop(.55,"#fff");g.addColorStop(1,"#000");x.fillStyle=g;x.fillRect(0,0,512,512);return new THREE.CanvasTexture(c)})();
const PHY=(c,o)=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:.35,metalness:0,clearcoat:.6,clearcoatRoughness:.25},o||{}));
function P(kind,geo,c,o){const m=new THREE.Mesh(geo,(c&&c.isMaterial)?c:MAT(c,o));m.castShadow=true;m.receiveShadow=true;m.userData.kind=kind;return m}
const Box=(w,h,d,c,o)=>P(w===h&&h===d?"куб":"параллелепипед",new RoundedBoxGeometry(w,h,d,3,Math.min(w,h,d)*.12),c,o);
const Cyl=(a,b,h,c,o,s=40)=>P("цилиндр",new THREE.CylinderGeometry(a,b,h,s),c,o);
const Sph=(r,c,o)=>P("сфера",new THREE.SphereGeometry(r,48,32),c,o);
const Cone=(r,h,c,o)=>P("конус",new THREE.ConeGeometry(r,h,48),c,o);
function Prism(w,h,d,c){const s=new THREE.Shape();s.moveTo(-w/2,0);s.lineTo(w/2,0);s.lineTo(0,h);s.lineTo(-w/2,0);const g=new THREE.ExtrudeGeometry(s,{depth:d,bevelEnabled:true,bevelSize:.03,bevelThickness:.03,bevelSegments:3});g.translate(0,0,-d/2);return P("призма",g,c)}
function at(m,x,y,z,rx,ry,rz){m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);return m}
function sc(m,x,y,z){m.scale.set(x,y,z);return m}
function grp(...a){const g=new THREE.Group();a.forEach(m=>g.add(m));return g}
function canvasTex(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;draw(c.getContext("2d"),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=4;return t}

/* --- glTF модельдер --- */
const ASSET={"camera": "ef6ad428f18a3f090acc51206c3791e3", "car": "197dde8599197fe65c8798a9259154ab", "chair": "af88b06d5d3593ddb1239b509ddf1504", "fox": "2a1c8b41be5d537b1dea7312386319d5", "lamp": "9be167dfee7c8fc52d07779cc41f54cf", "robot": "4859ed4bca2ad09d1dd4a0db05e59f86", "skull": "fc18aed3edf2d75356e8a425bf82b0b9", "sofa": "8ee6d0625db89ac1dbd6325dba0d2f9e", "tokyo": "5dfd5b091afe1e2c7b5214d873617433", "k-building-garage": "7f2fb16d9702a851b5a3e15e9e12641a", "k-building-small-a": "0cdeaf4821ec1327e8d49bc7a7b2caef", "k-building-small-b": "5fad436d63467341f779994d3b01fbb7", "k-building-small-c": "34e069a4a9280119144c769c0ec13d05", "k-building-small-d": "a4f9085dc967cb2648b49dd7201545ff", "k-character": "4caac2562eb58bf0e3f8620df71bdaf1", "k-cloud": "2ead2856b40fe693f077266a8f595fc7", "k-coin": "880175af6edcf0a17ed61cdc43808e44", "k-decoration-forest": "f8a99023a1ed8a070509fb632d5aafe2", "k-decoration-tents": "2798ca583527ba690e0654e593ae5640", "k-flag": "20f44e0d6af4e60e3a17e50b4639f28e", "k-grass-trees-tall": "5b7db64b4bba0240a526da0a41dcaab2", "k-grass-trees": "454bec0e99164fdbdee01cca3f7be1c9", "k-grass": "12e2f4ce40c4f3051f6339f6561c3342", "k-pavement-fountain": "25e0847059cb5001e1c268da69017277", "k-platform-grass-large-round": "636cfd7b726f8a19011807653c0e2e2e", "k-vehicle-truck-red": "afaab9c2e61df1ec04549f04965da3c9"};
const gltfLoader=new GLTFLoader();const gcache={};
function gl(name){return gcache[name]||(gcache[name]=gltfLoader.loadAsync("models/"+name+".glb").then(g=>{
 g.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;[].concat(o.material).forEach(m=>{if(m.aoMap&&m.aoMap.channel===1&&!o.geometry.attributes.uv1)m.aoMap.channel=0})}});return g}))}
async function model(name,skinned){const g=await gl(name);const o=skinned?SkeletonUtils.clone(g.scene):g.scene.clone(true);return{obj:o,anims:g.animations}}
function fit(o,size,mode){const w=new THREE.Group();w.add(o);w.updateMatrixWorld(true);const b=new THREE.Box3().setFromObject(o,true);const s=b.getSize(V3());
 const ref=mode==="max"?Math.max(s.x,s.y,s.z):mode==="len"?Math.max(s.x,s.z):s.y;o.scale.multiplyScalar(size/ref);w.updateMatrixWorld(true);
 const b2=new THREE.Box3().setFromObject(o,true);const c=b2.getCenter(V3());o.position.x-=c.x;o.position.z-=c.z;o.position.y-=b2.min.y;return w}
function edgesOf(root,color){const add=[];root.traverse(o=>{if(o.isMesh){const e=new THREE.LineSegments(new THREE.EdgesGeometry(o.geometry,25),new THREE.LineBasicMaterial({color:color||"#1b1f2a"}));add.push([o,e])}});add.forEach(([o,e])=>o.add(e))}

/* --- Көрермен (viewer) --- */
class Viewer{
 constructor(host,cfg){
  this.cfg=cfg;this.builders=cfg.builders.map(n=>SCN[n]);this.state={};this.tok=0;this.mixers=[];
  const multi=this.builders.length>1;
  const w=el("div","v3",`<div class="v3-stage" style="height:${cfg.h||340}px"><div class="v3-labels"></div><div class="v3-cap"></div><div class="v3-hint">Сүйреп айналдырыңыз · жақындату — дөңгелекпен</div>${multi?'<button class="v3-nav prev" aria-label="Алдыңғы модель"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button><button class="v3-nav next" aria-label="Келесі модель"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg></button><div class="v3-count"></div>':""}<div class="v3-frame"></div><div class="v3-load"><i></i>3D модель жүктелуде…</div></div><div class="v3-tools"></div>`);
  host.appendChild(w);this.el=w;this.stage=$(".v3-stage",w);this.lab=$(".v3-labels",w);this.tools=$(".v3-tools",w);this.cap=$(".v3-cap",w);this.cnt=$(".v3-count",w);this.ld=$(".v3-load",w);
  if(multi){$(".prev",w).onclick=()=>this.show(this.idx-1,true);$(".next",w).onclick=()=>this.show(this.idx+1,true)}
  const r=this.renderer=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;
  r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
  this.stage.prepend(r.domElement);
  this.camera0=new THREE.PerspectiveCamera(40,1,.05,300);this.post=makeComposer(r,this.camera0,{radius:.45,k:.9});
  const pm=new THREE.PMREMGenerator(r);this.env=pm.fromScene(new RoomEnvironment(),.04).texture;pm.dispose();
  this.camera=this.camera0;
  this.controls=new OrbitControls(this.camera,r.domElement);this.controls.enableDamping=true;this.controls.dampingFactor=.08;this.controls.minDistance=1.2;this.controls.maxDistance=30;this.controls.enablePan=false;this.controls.maxPolarAngle=Math.PI*.495;
  this.visible=true;this.t=0;this.clock=new THREE.Clock();this.v=V3();
  this.io=new IntersectionObserver(es=>{this.visible=es[0].isIntersecting});this.io.observe(this.stage);
  this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(this.stage);
  this.cur={};this.show(0);this.resize();this.loop();
 }
 fit(){if(!this.base)return;const a=this.camera.aspect||2.5;const k=Math.min(2.3,Math.max(1,Math.pow(2.55/a,.8)));this.camera.position.copy(this.base.p).sub(this.base.t).multiplyScalar(k).add(this.base.t);this.controls.target.copy(this.base.t);this.controls.update()}
 resize(){const W=this.stage.clientWidth,H=this.stage.clientHeight;if(!W)return;const was=this.camera.aspect;this.renderer.setSize(W,H);if(this.post)this.post.setSize(W,H);this.camera.aspect=W/H;this.camera.updateProjectionMatrix();if(Math.abs(was-W/H)>.05)this.fit()}
 clear(){if(!this.scene)return;this.scene.traverse(o=>{if(o.userData.own){if(o.geometry)o.geometry.dispose()}})}
 async show(i,fromNav){const n=this.builders.length;i=(i%n+n)%n;this.idx=i;const tok=++this.tok;this.clear();
  const s=this.scene=new THREE.Scene();s.background=new THREE.Color("#e7edf7");s.environment=this.env;if(this.post)this.post.setScene(s);
  s.add(new THREE.HemisphereLight(0xffffff,0x8d97ad,.55));
  const d=new THREE.DirectionalLight(0xffffff,2.4);d.position.set(5,10,6);d.castShadow=true;d.shadow.mapSize.set(2048,2048);const c=d.shadow.camera;c.left=c.bottom=-9;c.right=c.top=9;c.far=40;d.shadow.bias=-.0004;d.shadow.normalBias=.02;d.shadow.radius=4;s.add(d);this.sun=d;
  const back=new THREE.DirectionalLight(0xdfe8ff,.7);back.position.set(-6,4,-6);s.add(back);
  const g=this.ground=new THREE.Mesh(new THREE.CircleGeometry(16,96),new THREE.MeshStandardMaterial({color:"#e2e9f4",roughness:.95,alphaMap:groundAlpha,transparent:true,depthWrite:false}));g.rotation.x=-Math.PI/2;g.receiveShadow=true;g.renderOrder=-1;s.add(g);
  this.mixers=[];this.labels=[];this.lab.innerHTML="";this.tools.innerHTML="";this.stage.classList.remove("render");
  this.controls.autoRotate=false;this.controls.enabled=true;this.fly=null;this.cur={};
  this.cap.innerHTML="";if(this.cnt)this.cnt.textContent=`${i+1} / ${n}`;
  const lt=setTimeout(()=>this.ld.classList.add("on"),120);
  const alive=()=>tok===this.tok;const ctx=this.ctx(s,alive);
  let res;try{res=await this.builders[i](s,ctx)||{}}catch(e){console.error(e);res={cap:"Модель жүктелмеді — бетті жаңартыңыз"}}
  clearTimeout(lt);if(!alive())return;this.ld.classList.remove("on");
  if(s.background&&s.background.isColor){const bc=s.background.clone();const top=bc.clone().lerp(new THREE.Color("#ffffff"),.55);const gc=this.ground.visible?this.ground.material.color.clone().lerp(bc,.35):bc;s.background=gradBg("#"+top.getHexString(),"#"+gc.getHexString())}
  this.cur=res;this.base={p:V3(...(res.cam||[5,4,7])),t:V3(...(res.target||[0,1,0]))};this.fit();
  this.cap.innerHTML=res.cap?`<span>${res.cap}</span>`:"";
  if(fromNav&&this.cfg.onIndex)this.cfg.onIndex(i);
 }
 ctx(s,alive){const V=this;const dummy=()=>({d:el("div"),obj:new THREE.Object3D()});
  return{scene:s,state:V.state,get ground(){return V.ground},get sun(){return V.sun},camera:V.camera,controls:V.controls,stage:V.stage,env:V.env,
   label:(...a)=>alive()?V.label(...a):dummy(),btn:(...a)=>alive()?V.btn(...a):el("button"),msg:(...a)=>alive()?V.msg(...a):el("span"),
   range:(...a)=>alive()?V.range(...a):el("input"),swatches:(...a)=>alive()&&V.swatches(...a),flyTo:(...a)=>alive()&&V.flyTo(...a),
   play:(...a)=>V.play(...a),alive}}
 select(i){if(this.cfg.link==="carousel")this.show(i);else if(this.cur.focus)this.cur.focus(i)}
 label(obj,text,dy=.3,cls=""){const d=el("div","v3-label "+cls,text);this.lab.appendChild(d);const L={obj,d,dy};this.labels.push(L);return L}
 btn(text,fn){const b=el("button","v3-btn",text);b.onclick=()=>fn(b);this.tools.appendChild(b);return b}
 msg(text){const m=el("span","v3-msg",text||"");this.tools.appendChild(m);return m}
 range(min,max,val,fn){const r=el("input");r.type="range";r.min=min;r.max=max;r.value=val;r.oninput=()=>fn(+r.value);this.tools.appendChild(r);return r}
 swatches(cols,fn){cols.forEach(c=>{const b=el("button","sw");b.style.background=c;b.title=c;b.onclick=()=>fn(c);this.tools.appendChild(b)})}
 flyTo(pos,target,dur=1){this.fly={p0:this.camera.position.clone(),t0:this.controls.target.clone(),p1:V3(...pos),t1:V3(...target),k:0,dur}}
 play(obj,anims,name,speed){const m=new THREE.AnimationMixer(obj);const clip=THREE.AnimationClip.findByName(anims,name)||anims[0];const a=m.clipAction(clip);a.timeScale=speed||1;a.play();this.mixers.push(m);return{mixer:m,action:a}}
 loop(){this.raf=requestAnimationFrame(()=>this.loop());const dt=Math.min(this.clock.getDelta(),.05);if(!this.visible)return;this.t+=dt;
  for(const m of this.mixers)m.update(dt);
  if(this.cur.update)this.cur.update(this.t,dt);
  if(this.fly){const f=this.fly;f.k=Math.min(1,f.k+dt/f.dur);const e=f.k<.5?2*f.k*f.k:1-Math.pow(-2*f.k+2,2)/2;this.camera.position.lerpVectors(f.p0,f.p1,e);this.controls.target.lerpVectors(f.t0,f.t1,e);if(f.k>=1)this.fly=null}
  this.controls.update();if(this.post)this.post.c.render(dt);else this.renderer.render(this.scene,this.camera);
  const W=this.stage.clientWidth,H=this.stage.clientHeight;
  for(const L of this.labels){if(!L.obj.visible||!L.obj.parent){L.d.style.display="none";continue}L.obj.getWorldPosition(this.v);this.v.y+=L.dy;this.v.project(this.camera);
   if(this.v.z>1){L.d.style.display="none";continue}L.d.style.display="";L.d.style.transform=`translate(${(this.v.x*.5+.5)*W}px,${(-this.v.y*.5+.5)*H}px) translate(-50%,-100%)`}
 }
 dispose(){cancelAnimationFrame(this.raf);this.tok++;if(this.post){try{this.post.c.passes.forEach(p=>p.dispose&&p.dispose());this.post.c.dispose()}catch(e){}}this.io.disconnect();this.ro.disconnect();this.controls.dispose();this.env.dispose();this.renderer.dispose();try{this.renderer.forceContextLoss()}catch(e){}this.el.remove()}
}

/* --- Процедуралық әдемі нысандар --- */
function mkHouseP(){return grp(
 at(Box(1.4,1.4,1.4,"#f6f1e7"),0,.7,0),at(Prism(1.9,.85,1.7,"#c8432f"),0,1.4,0),
 at(Box(.24,.5,.24,"#9c4a3a"),.45,1.95,-.2),at(Box(.34,.62,.06,"#6b4226"),0,.31,.71),
 at(Box(.32,.32,.06,"#8cc7f0",{roughness:.1,metalness:.2}),-.42,.9,.71),at(Box(.32,.32,.06,"#8cc7f0",{roughness:.1,metalness:.2}),.42,.9,.71))}
function mkCarP(c){const body=at(Box(2.1,.45,1.05,c||"#e0483e"),0,.55,0);const g=grp(body,at(Box(1.15,.42,.95,"#a9d8f5",{roughness:.15,metalness:.3}),-.1,.985,0));
 for(const x of[-.68,.68])for(const z of[-.53,.53]){g.add(at(Cyl(.27,.27,.22,"#2b2f36"),x,.27,z,Math.PI/2));g.add(at(Cyl(.12,.12,.24,"#c9ced6",{metalness:.8,roughness:.3}),x,.27,z,Math.PI/2))}
 return g}
function mkChairP(){const w="#b9824f",g=grp(at(Box(1,.1,1,w),0,.9,0));
 for(const x of[-.42,.42])for(const z of[-.42,.42])g.add(at(Cyl(.05,.05,.9,w),x,.45,z));
 for(const x of[-.42,.42])g.add(at(Cyl(.05,.05,.9,w),x,1.4,-.42));
 g.add(at(Box(.9,.25,.06,w),0,1.65,-.42));g.add(at(Box(.9,.08,.06,w),0,1.25,-.42));return g}
function mkAppleP(){return grp(sc(at(Sph(.7,"#d32f2f",{roughness:.35}),0,.65,0),1,.9,1),at(Cyl(.03,.045,.32,"#6b4423"),0,1.35,0,0,0,.15))}
function mkAppleReal(){const pts=[[0,.07],[.16,.03],[.36,.06],[.54,.18],[.66,.38],[.7,.6],[.65,.82],[.52,.98],[.34,1.06],[.18,1.03],[.07,.95],[0,.9]].map(([x,y])=>new THREE.Vector2(x,y));
 const tex=canvasTex(512,256,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"#9ccc65");g.addColorStop(.25,"#e53935");g.addColorStop(.7,"#c62828");g.addColorStop(1,"#8e1b1b");c.fillStyle=g;c.fillRect(0,0,w,h);
  for(let i=0;i<220;i++){c.strokeStyle=`rgba(${120+Math.random()*80|0},${Math.random()*30|0},20,.25)`;c.lineWidth=1+Math.random()*3;const x=Math.random()*w;c.beginPath();c.moveTo(x,h*.15);c.bezierCurveTo(x+8,h*.4,x-8,h*.7,x+4,h);c.stroke()}
  for(let i=0;i<160;i++){c.fillStyle="rgba(255,236,170,.5)";c.beginPath();c.arc(Math.random()*w,h*.2+Math.random()*h*.8,1.2,0,7);c.fill()}});
 const body=new THREE.Mesh(new THREE.LatheGeometry(pts,64),PHY("#ffffff",{map:tex,clearcoat:.8,roughness:.35}));body.castShadow=true;
 const stem=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([V3(0,.9,0),V3(.02,1.1,0),V3(.09,1.24,0)]),12,.028,8),MAT("#5d3b1e"));stem.castShadow=true;
 const ls=new THREE.Shape();ls.moveTo(0,0);ls.quadraticCurveTo(.16,.12,.36,0);ls.quadraticCurveTo(.16,-.12,0,0);
 const leaf=new THREE.Mesh(new THREE.ExtrudeGeometry(ls,{depth:.01,bevelEnabled:true,bevelThickness:.01,bevelSize:.01,bevelSegments:2}),PHY("#43a047",{clearcoat:.4}));leaf.position.set(.06,1.17,0);leaf.rotation.set(.4,.3,.5);leaf.castShadow=true;
 return grp(body,stem,leaf)}
function heartGeo(){const s=new THREE.Shape();const x=0,y=0;s.moveTo(x+25,y+25);s.bezierCurveTo(x+25,y+25,x+20,y,x,y);s.bezierCurveTo(x-30,y,x-30,y+35,x-30,y+35);s.bezierCurveTo(x-30,y+55,x-10,y+77,x+25,y+95);s.bezierCurveTo(x+60,y+77,x+80,y+55,x+80,y+35);s.bezierCurveTo(x+80,y+35,x+80,y,x+50,y);s.bezierCurveTo(x+35,y,x+25,y+25,x+25,y+25);
 const g=new THREE.ExtrudeGeometry(s,{depth:22,bevelEnabled:true,bevelThickness:14,bevelSize:10,bevelSegments:10,curveSegments:40});g.center();g.rotateZ(Math.PI);g.scale(.0125,.0125,.0125);return g}
function mkHeart(){const red=PHY("#d32f2f",{clearcoat:1,clearcoatRoughness:.15,roughness:.4,sheen:.5,sheenColor:new THREE.Color("#ff8a80")});
 const h=new THREE.Mesh(heartGeo(),red);h.castShadow=true;
 const tube=(pts,r,c)=>{const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>V3(...p))),40,r,16),PHY(c,{clearcoat:.8}));m.castShadow=true;return m};
 const aorta=tube([[.15,.35,0],[.2,.85,0],[.05,1.1,0],[-.3,1.05,0],[-.45,.8,0]],.13,"#e53935");
 const vena=tube([[-.38,.35,.1],[-.42,.8,.12],[-.4,1.15,.1]],.11,"#1e5fbf");
 const pulm=tube([[.35,.4,.15],[.5,.8,.1],[.75,.95,0]],.1,"#3949ab");
 const inner=grp(h,aorta,vena,pulm);const g=grp(inner);g.position.y=1.35;g.userData.inner=inner;return g}
function gearGeo(R,teeth,depth){const s=new THREE.Shape();const r1=R*.84;const n=teeth;const pts=[];
 for(let i=0;i<n;i++){const a=i/n*Math.PI*2,st=Math.PI*2/n;[[r1,0],[R,.22],[R,.48],[r1,.7]].forEach(([r,f])=>pts.push([Math.cos(a+st*f)*r,Math.sin(a+st*f)*r]))}
 s.moveTo(...pts[0]);pts.slice(1).forEach(p=>s.lineTo(...p));s.closePath();
 const hole=new THREE.Path();hole.absarc(0,0,R*.2,0,Math.PI*2,true);s.holes.push(hole);
 for(let k=0;k<5;k++){const a=k/5*Math.PI*2,h=new THREE.Path();h.absarc(Math.cos(a)*R*.52,Math.sin(a)*R*.52,R*.16,0,Math.PI*2,true);s.holes.push(h)}
 const g=new THREE.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelThickness:.03,bevelSize:.025,bevelSegments:3,curveSegments:24});g.translate(0,0,-depth/2);return g}
function mkPlane(){const W="#f4f6fa",B="#1565c0";
 const prof=[[0,1.95],[.08,1.9],[.2,1.72],[.3,1.4],[.34,.9],[.34,-.9],[.3,-1.35],[.18,-1.8],[.07,-2.02],[0,-2.05]].map(([r,y])=>new THREE.Vector2(r,y));
 const fus=new THREE.Mesh(new THREE.LatheGeometry(prof,48),PHY(W,{clearcoat:1}));fus.rotation.z=-Math.PI/2;
 const wingS=new THREE.Shape();wingS.moveTo(.45,0);wingS.lineTo(-.35,0);wingS.lineTo(-.85,1.9);wingS.lineTo(-.5,1.9);wingS.closePath();
 const wg=new THREE.ExtrudeGeometry(wingS,{depth:.06,bevelEnabled:true,bevelThickness:.02,bevelSize:.02,bevelSegments:2});
 const wing=(s)=>{const m=new THREE.Mesh(wg,PHY("#dfe5ee"));m.rotation.x=s*Math.PI/2;m.position.set(.1,-.12,0);m.castShadow=true;return m};
 const tS=new THREE.Shape();tS.moveTo(.1,0);tS.lineTo(-.45,0);tS.lineTo(-.75,.8);tS.lineTo(-.5,.8);tS.closePath();
 const fin=new THREE.Mesh(new THREE.ExtrudeGeometry(tS,{depth:.05,bevelEnabled:true,bevelThickness:.015,bevelSize:.015}),PHY("#00a3dd"));fin.position.set(-1.55,.2,-.025);
 const stS=new THREE.Shape();stS.moveTo(.1,0);stS.lineTo(-.3,0);stS.lineTo(-.5,.7);stS.lineTo(-.32,.7);stS.closePath();const stg=new THREE.ExtrudeGeometry(stS,{depth:.04,bevelEnabled:false});
 const st=s=>{const m=new THREE.Mesh(stg,PHY("#dfe5ee"));m.rotation.x=s*Math.PI/2;m.position.set(-1.6,.12,0);return m};
 const eng=z=>{const e=new THREE.Mesh(new THREE.CylinderGeometry(.13,.11,.55,32),PHY("#b0bec5",{metalness:.6}));e.rotation.z=Math.PI/2;e.position.set(.25,-.32,z);e.castShadow=true;return e};
 const stripe=new THREE.Mesh(new THREE.CylinderGeometry(.345,.345,2.4,48,1,true),PHY(B));stripe.rotation.z=Math.PI/2;stripe.scale.set(1,1,1);stripe.position.y=-.02;
 const g=grp(fus,wing(-1),wing(1),fin,st(-1),st(1),eng(.85),eng(-.85));
 for(let i=0;i<14;i++)for(const z of[.31,-.31]){const w=new THREE.Mesh(new THREE.SphereGeometry(.035,12,8),MAT("#263238",{roughness:.1}));w.scale.set(1,1.4,.5);w.position.set(1.2-i*.17,.12,z);g.add(w)}
 const cockpit=new THREE.Mesh(new THREE.SphereGeometry(.2,24,12,0,Math.PI*2,0,Math.PI/2.4),MAT("#263238",{roughness:.05,metalness:.5}));cockpit.position.set(1.55,.08,0);cockpit.scale.set(1.3,.7,1.3);g.add(cockpit);
 g.traverse(o=>{if(o.isMesh)o.castShadow=true});g.position.y=1.6;return g}
function ballTex(){return canvasTex(512,256,(c,w,h)=>{const cols=["#ff7043","#ffffff","#42a5f5","#ffffff","#ffca28","#ffffff"];cols.forEach((cl,i)=>{c.fillStyle=cl;c.fillRect(i*w/6,0,w/6+1,h)})})}

/* explode helper */
function explodable(g,v){const parts=g.children.filter(c=>c.isMesh).map(m=>{const p=m.position.clone();const d=p.clone().sub(V3(0,.9,0));if(d.length()<.05)d.set(0,1,0);d.normalize();return{m,p,e:p.clone().add(d.multiplyScalar(.75)).add(V3(0,.25,0))}});
 return dt=>{parts.forEach(o=>{o.m.position.lerp(v.state.ex&&!v.state.real?o.e:o.p,Math.min(1,dt*6))})}}
async function primScene(s,v,prim,realName,realFn,cam,cap){
 let real=null;if(realName){const m=await model(realName);real=realFn(m.obj)}else if(realFn)real=realFn();
 if(!v.alive())return{};s.add(prim);if(real){s.add(real);}
 const ex=explodable(prim,v);
 const sync=()=>{prim.visible=!v.state.real;if(real)real.visible=!!v.state.real;b1.classList.toggle("on",!!v.state.ex);b1.textContent=v.state.ex?"Жинау":"Бөлшектеу";b2.classList.toggle("on",!!v.state.real);b2.textContent=v.state.real?"Фигуралардан":"Нақты модель"};
 const b1=v.btn("Бөлшектеу",()=>{v.state.ex=!v.state.ex;v.state.real=false;sync()});
 const b2=v.btn("Нақты модель",()=>{v.state.real=!v.state.real;sync()});
 sync();
 return{cam,target:[0,.9,0],cap,update(t,dt){ex(dt);if(real&&real.visible)real.rotation.y=Math.sin(t*.4)*.3}}}

/* ---------- Сахналар ---------- */
const SCN={
 async shelf(s,v){
  const [car,robot,house]=await Promise.all([model("car"),model("robot",true),model("k-building-small-d")]);
  const narrow=v.stage.clientWidth/v.stage.clientHeight<1.5;const spots=narrow?[[-2.1,0,-1.5],[0,0,-1.5],[2.1,0,-1.5],[-2.1,0,1.5],[0,0,1.5],[2.1,0,1.5]]:[-5,-3,-1,1,3,5].map(x=>[x,0,0]);const rings=[],objs=[],labs=[];
  const photo=canvasTex(512,360,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,"#4fa3e8");gr.addColorStop(1,"#cfeaff");c.fillStyle=gr;c.fillRect(0,0,w,h);c.fillStyle="#ffe082";c.beginPath();c.arc(400,80,40,0,7);c.fill();
   c.fillStyle="#6d8f5e";c.beginPath();c.moveTo(0,h);c.lineTo(150,140);c.lineTo(300,h);c.fill();c.fillStyle="#476d3c";c.beginPath();c.moveTo(170,h);c.lineTo(350,170);c.lineTo(512,h);c.fill();c.fillStyle="#fff";c.beginPath();c.moveTo(150,140);c.lineTo(125,175);c.lineTo(178,172);c.fill();c.strokeStyle="#fff";c.lineWidth=22;c.strokeRect(0,0,w,h)});
  const paper=canvasTex(512,360,(c,w,h)=>{c.fillStyle="#fffdf5";c.fillRect(0,0,w,h);c.strokeStyle="#2b2b2b";c.lineWidth=6;c.lineJoin="round";c.strokeRect(140,170,220,150);c.beginPath();c.moveTo(120,174);c.lineTo(250,70);c.lineTo(380,174);c.stroke();c.strokeRect(225,235,55,85);c.strokeStyle="#f9a825";c.beginPath();c.arc(430,70,30,0,7);c.stroke();c.strokeStyle="#43a047";c.beginPath();c.moveTo(0,330);c.quadraticCurveTo(250,300,512,335);c.stroke()});
  const flat=tex=>{const w=MAT("#f7f8fa",{roughness:.8,emissive:"#ffffff",emissiveIntensity:.35});const m=new THREE.Mesh(new THREE.BoxGeometry(1.5,1.05,.02),[w,w,w,w,new THREE.MeshStandardMaterial({map:tex,roughness:.7}),w]);m.castShadow=true;return m};
  const ring=new THREE.Mesh(new THREE.RingGeometry(.48,.56,96),new THREE.MeshStandardMaterial({color:"#1e6fe0",side:THREE.DoubleSide}));ring.castShadow=true;
  const rb=fit(robot.obj,1.7);v.play(robot.obj,robot.anims,"Wave");
  const items=[at(flat(photo),0,.95,0,0,.25,0),fit(house.obj,1.5),at(ring,0,.85,0,0,.3,0),fit(car.obj,1.85,"len"),at(flat(paper),0,.75,0,-.12,-.15,0),rb];
  items[3].rotation.y=.6;
  spots.forEach((p,i)=>{const ped=at(Cyl(.8,.86,.18,PHY("#ffffff",{clearcoat:.3})),p[0],.09,p[2]);s.add(ped);
   const rg=new THREE.Mesh(new THREE.TorusGeometry(.83,.035,8,64),MAT("#c5cde0"));rg.rotation.x=Math.PI/2;rg.position.set(p[0],.19,p[2]);s.add(rg);rings.push(rg);
   const g=grp(items[i]);g.position.set(p[0],.18,p[2]);s.add(g);objs.push(g);labs.push(v.label(g,String(i+1),1.85,"big"))});
  let cur=-1;
  return{cam:narrow?[0,3.3,4.4]:[0,2.5,7.4],target:[0,.6,0],cap:"Нысанды бүйірінен қараңыз",
   focus(i){cur=i;rings.forEach((r,j)=>{r.material.color.set(j===i?"#7a3cf0":"#c5cde0");r.material.emissive.set(j===i?"#3a1290":"#000")});labs.forEach((l,j)=>l.d.classList.toggle("on",j===i));const p=spots[i];v.flyTo([p[0]+2.2,2.2,p[2]+3.1],[p[0],.85,p[2]],.9)},
   update(t){objs.forEach((g,j)=>{if(j===5)return;g.rotation.y=j===cur?t*.9:Math.sin(t*.5+j)*.35;g.position.y=.18+(j===cur?.1+Math.sin(t*3)*.04:0)})}}},
 async studio(s,v){
  const [robot,cam,lamp]=await Promise.all([model("robot",true),model("camera"),model("lamp")]);
  s.background=new THREE.Color("#d9dfea");v.sun.intensity=.9;v.ground.material.color.set("#cfd7e4");
  const pod=at(Cyl(1.3,1.4,.25,PHY("#ffffff",{clearcoat:.5})),0,.125,0);s.add(pod);
  const rb=fit(robot.obj,2);rb.position.y=.25;s.add(rb);v.play(robot.obj,robot.anims,"Dance");
  const camG=new THREE.Group();for(let k=0;k<3;k++){const a=k/3*Math.PI*2+.5;const leg=new THREE.Mesh(new THREE.CylinderGeometry(.025,.03,1.75,12),MAT("#2b2f36",{metalness:.6,roughness:.4}));leg.position.set(Math.cos(a)*.32,.85,Math.sin(a)*.32);leg.rotation.set(Math.sin(a)*.2,0,-Math.cos(a)*.2);leg.castShadow=true;camG.add(leg)}
  const head=new THREE.Group();head.add(fit(cam.obj,.85,"max"));head.position.y=1.7;camG.add(head);camG.position.set(3.1,0,1.6);s.add(camG);camG.lookAt(0,0,0);camG.rotateY(Math.PI/2);
  const lp=fit(lamp.obj,2);lp.position.set(-2.7,0,1.2);lp.rotation.y=-.6;s.add(lp);
  const sp=new THREE.SpotLight(0xffe2b0,40,12,.55,.5,1.6);sp.position.set(-2.3,2,1.2);sp.target=rb;sp.castShadow=true;s.add(sp);
  const bulb=new THREE.PointLight(0xffd59a,2,3);bulb.position.set(-2.4,1.5,1.3);s.add(bulb);
  v.label(rb,"Модель",2.4);v.label(head,"Камера",.95);v.label(lp,"Жарық",1.85);
  let rendering=false;const home=[-.6,3,7.4];
  v.btn("Рендер",b=>{rendering=!rendering;b.classList.toggle("on",rendering);b.textContent=rendering?"Студияға оралу":"Рендер";v.stage.classList.toggle("render",rendering);camG.visible=lp.visible=!rendering;
   s.background=new THREE.Color(rendering?"#9fc3ef":"#d9dfea");if(rendering){const wp=V3();head.getWorldPosition(wp);v.flyTo([wp.x*.92,wp.y,wp.z*.92],[0,1.3,0],1.1);v.controls.enabled=false}else{v.flyTo(home,[0,1.1,0],1.1);v.controls.enabled=true}});
  return{cam:home,target:[0,1.1,0],cap:"3D студия"}},
 async school(s,v){
  const ns=["k-building-small-b","k-building-small-c","k-building-small-a","k-pavement-fountain","k-grass-trees-tall","k-grass-trees","k-grass","k-building-garage"];
  const M=Object.fromEntries(await Promise.all(ns.map(async n=>[n,(await model(n)).obj])));const C=n=>M[n].clone(true);
  const g=new THREE.Group();const put=(n,x,z,ry=0)=>{const o=C(n);o.position.set(x,0,z);o.rotation.y=ry;g.add(o)};
  put("k-building-small-b",-1,-1);put("k-building-small-c",0,-1);put("k-building-small-b",1,-1);
  put("k-pavement-fountain",0,0);put("k-grass",-1,0);put("k-grass",1,0);put("k-grass-trees-tall",-2,-1);put("k-grass-trees",2,-1);put("k-grass-trees",-2,0);put("k-grass-trees-tall",2,0);
  put("k-grass",-1,1);put("k-grass",0,1);put("k-grass",1,1);put("k-building-garage",2,1);put("k-grass-trees",-2,1);
  g.scale.setScalar(1.25);s.add(g);
  const pole=at(Cyl(.02,.02,1.4,MAT("#cfd8dc",{metalness:.8,roughness:.3})),0,2.9,-1.25);s.add(pole);
  const flag=at(new THREE.Mesh(new THREE.PlaneGeometry(.55,.3,12,1),new THREE.MeshStandardMaterial({color:"#00afca",side:THREE.DoubleSide})),.29,3.42,-1.25);s.add(flag);
  const fp=flag.geometry.attributes.position,base=fp.array.slice();
  return{cam:[4.6,4.4,5.6],target:[0,.9,0],cap:"1 · Мектеп ғимаратының жобасы",update(t){for(let i=0;i<fp.count;i++){const x=base[i*3];fp.setZ(i,Math.sin(x*9-t*5)*.04*(x+.28))}fp.needsUpdate=true}}},
 async heart(s,v){s.background=new THREE.Color("#0e1a3a");v.ground.material.color.set("#18284f");v.sun.intensity=1.6;
  const g=mkHeart();s.add(g);const ring=new THREE.Mesh(new THREE.TorusGeometry(1.1,.015,8,96),new THREE.MeshBasicMaterial({color:"#ff8a80",transparent:true}));ring.position.y=1.35;s.add(ring);
  const ecgPts=[];for(let i=0;i<=200;i++){const x=i/200;let y=0;const k=(x*3)%1;if(k>.4&&k<.45)y=-.1;else if(k>.45&&k<.5)y=.55;else if(k>.5&&k<.55)y=-.2;else if(k>.65&&k<.75)y=.12*Math.sin((k-.65)/.1*Math.PI);ecgPts.push(V3(-2.6+x*5.2,y,0))}
  const ecg=new THREE.Line(new THREE.BufferGeometry().setFromPoints(ecgPts),new THREE.LineBasicMaterial({color:"#69f0ae"}));ecg.position.set(0,2.9,-1.6);s.add(ecg);
  const fill=new THREE.PointLight(0xff6f61,6,6);fill.position.set(0,1.4,1.6);s.add(fill);
  return{cam:[0,1.9,4.6],target:[0,1.45,0],cap:"Адам жүрегінің моделі",update(t){const k=t*1.2%1;const b=1+.08*Math.exp(-((k-.1)**2)/.002)+.05*Math.exp(-((k-.3)**2)/.003);g.userData.inner.scale.setScalar(b);g.rotation.y=Math.sin(t*.4)*.7;ring.scale.setScalar(.8+k*1.4);ring.material.opacity=1-k;ecg.geometry.setDrawRange(0,Math.floor((t*60)%201))}}},
 async robotGame(s,v){const[ch,coin,pl,cloud]=await Promise.all([model("k-character",true),model("k-coin"),model("k-platform-grass-large-round"),model("k-cloud")]);
  s.background=new THREE.Color("#bfe3ff");v.ground.material.color.set("#cfe8ff");
  const p=pl.obj;p.scale.setScalar(.9);s.add(p);const c=fit(ch.obj,1.4);c.position.y=.45;s.add(c);const act=v.play(ch.obj,ch.anims,"walk");
  const coins=[];for(let i=0;i<6;i++){const k=fit(coin.obj.clone(true),.45);const a=i/6*Math.PI*2;k.position.set(Math.cos(a)*1.6,.75,Math.sin(a)*1.6);s.add(k);coins.push(k)}
  for(const[x,y,z,sc_]of[[-3,3.2,-2.5,1],[2.8,3.8,-3,1.4],[0,4.2,-4,.8]]){const cl=cloud.obj.clone(true);cl.scale.setScalar(sc_);cl.position.set(x,y,z);s.add(cl)}
  return{cam:[2.4,2.3,3.5],target:[0,.9,0],cap:"Ойын кейіпкері",update(t,dt){const a=t*.8;c.position.x=Math.cos(a)*1.6;c.position.z=Math.sin(a)*1.6;c.rotation.y=-a;coins.forEach((k,i)=>{k.rotation.y=t*3+i;const d=Math.hypot(k.position.x-c.position.x,k.position.z-c.position.z);k.visible=d>.4||((t*2)%1)>.5})}}},
 async gear(s,v){s.background=new THREE.Color("#dfe6f0");
  const g1=new THREE.Mesh(gearGeo(1,18,.3),MAT("#c9ced6",{metalness:1,roughness:.28}));const g2=new THREE.Mesh(gearGeo(.62,11,.3),MAT("#d9a441",{metalness:1,roughness:.3}));
  [g1,g2].forEach(m=>{m.castShadow=true});const shaft=(x,y)=>at(new THREE.Mesh(new THREE.CylinderGeometry(.12,.12,.9,32),MAT("#5f6b7a",{metalness:.9,roughness:.35})),x,y,-.2,Math.PI/2);
  g1.position.set(-.55,1.4,0);g2.position.set(.98,1.4,0);s.add(g1,g2,shaft(-.55,1.4),shaft(.98,1.4));
  const plate=at(Box(3.4,2.4,.12,"#37474f",{metalness:.5,roughness:.5}),.2,1.3,-.65);s.add(plate);
  const stand=at(Box(3.6,.2,1.2,"#455a64",{metalness:.4}),.2,.1,-.3);s.add(stand);
  return{cam:[1.2,2.2,4.4],target:[.2,1.3,0],cap:"Автокөлік бөлшегі: тісті доңғалақтар",update(t,dt){g1.rotation.z+=dt*.7;g2.rotation.z-=dt*.7*18/11}}},
 async room(s,v){const[sofa,chair,lamp]=await Promise.all([model("sofa"),model("chair"),model("lamp")]);
  const wood=canvasTex(512,512,(c,w,h)=>{for(let i=0;i<8;i++){c.fillStyle=["#c9a27a","#bf9670","#d1ab84","#c49b72"][i%4];c.fillRect(0,i*64,w,64);c.strokeStyle="rgba(80,50,20,.35)";c.strokeRect(((i*137)%w),i*64,1,64);c.fillStyle="rgba(90,60,30,.15)";c.fillRect(0,i*64+62,w,2)}});wood.wrapS=wood.wrapT=THREE.RepeatWrapping;wood.repeat.set(2,2);
  const floor=at(new THREE.Mesh(new RoundedBoxGeometry(5,.12,4,2,.03),MAT("#ffffff",{map:wood,roughness:.6})),0,.06,0);floor.receiveShadow=true;s.add(floor);
  const wallM=MAT("#f1ece3",{roughness:.9});s.add(at(Box(5,2.6,.12,wallM),0,1.3,-2),at(Box(.12,2.6,4,MAT("#e6dfd2",{roughness:.9})),-2.5,1.3,0));
  const win=at(Box(1.4,1,.05,MAT("#bfe3ff",{emissive:"#9fd0ff",emissiveIntensity:.6,roughness:.1})),1.2,1.55,-1.93);s.add(win);s.add(at(Box(1.5,.06,.12,"#ffffff"),1.2,1.03,-1.9));
  const rug=canvasTex(512,512,(c,w,h)=>{c.fillStyle="#b23a2e";c.fillRect(0,0,w,h);c.strokeStyle="#f3d27a";c.lineWidth=14;c.strokeRect(30,30,w-60,h-60);c.fillStyle="#f3d27a";for(const[x,y]of[[w/2,h/2]]){c.save();c.translate(x,y);for(let k=0;k<4;k++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(0,0);c.bezierCurveTo(40,-20,90,-60,60,-120);c.bezierCurveTo(30,-80,10,-60,0,0);c.fill()}c.restore()}
   c.fillStyle="#2e5a87";for(let i=0;i<4;i++){c.save();c.translate([90,w-90][i%2],[90,h-90][i>>1]);c.beginPath();c.arc(0,0,30,0,7);c.fill();c.restore()}});
  s.add(at(new THREE.Mesh(new THREE.BoxGeometry(2.4,.02,1.7),MAT("#ffffff",{map:rug,roughness:1})),.1,.13,.3));
  const so=fit(sofa.obj,2.4,"len");so.position.set(-.3,.12,-1.35);s.add(so);
  const ch=fit(chair.obj,1.1,"len");ch.position.set(1.4,.12,.4);ch.rotation.y=-1.9;s.add(ch);
  const lp=fit(lamp.obj,1.3);lp.position.set(-2,.12,-1.5);s.add(lp);const pl=new THREE.PointLight(0xffd59a,3,4);pl.position.set(-1.9,1.25,-1.4);s.add(pl);
  const tbl=grp(at(Cyl(.45,.45,.05,PHY("#5d4037",{clearcoat:.8})),0,.46,0),at(Cyl(.05,.08,.42,MAT("#3e2723")),0,.23,0),at(Cyl(.25,.28,.03,MAT("#3e2723")),0,.02,0));tbl.position.set(.1,.12,.3);s.add(tbl);
  const pot=new THREE.Mesh(new THREE.LatheGeometry([[0,0],[.16,0],[.2,.3],[.18,.32],[0,.32]].map(p=>new THREE.Vector2(...p)),32),PHY("#e0e0e0"));pot.position.set(2,.12,-1.5);pot.castShadow=true;s.add(pot);
  for(let i=0;i<9;i++){const l=new THREE.Mesh(new THREE.SphereGeometry(.16,16,12),MAT(i%2?"#2e7d32":"#43a047"));l.scale.set(.6,1.4,.6);l.position.set(2+Math.cos(i)*.15,.62+(i%3)*.12,-1.5+Math.sin(i)*.15);l.rotation.z=Math.cos(i)*.5;l.castShadow=true;s.add(l)}
  const frame=at(Box(1,.65,.05,"#3e2723"),-.3,1.85,-1.93);s.add(frame);s.add(at(new THREE.Mesh(new THREE.PlaneGeometry(.88,.53),new THREE.MeshStandardMaterial({map:canvasTex(256,160,(c,w,h)=>{const g=c.createLinearGradient(0,0,0,h);g.addColorStop(0,"#ffcc80");g.addColorStop(1,"#ff7043");c.fillStyle=g;c.fillRect(0,0,w,h);c.fillStyle="#5d4037";c.beginPath();c.moveTo(0,h);c.lineTo(90,70);c.lineTo(170,h);c.fill();c.fillStyle="#795548";c.beginPath();c.moveTo(100,h);c.lineTo(190,90);c.lineTo(256,h);c.fill()})})),-.3,1.85,-1.9));
  return{cam:[3.6,3.1,4.6],target:[-.1,.8,-.4],cap:"Бөлме интерьері"}},
 async edBlender(s,v){const r=await model("robot",true);s.background=new THREE.Color("#393c42");v.ground.visible=false;const gh=new THREE.GridHelper(14,28,"#6b6f78","#4a4e56");s.add(gh);
  const xa=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V3(-7,0.002,0),V3(7,0.002,0)]),new THREE.LineBasicMaterial({color:"#c0392b"}));const ya=new THREE.Line(new THREE.BufferGeometry().setFromPoints([V3(0,.002,-7),V3(0,.002,7)]),new THREE.LineBasicMaterial({color:"#7cb342"}));s.add(xa,ya);
  const o=fit(r.obj,2.2);s.add(o);v.play(r.obj,r.anims,"Running");v.label(o,"анимация · риг · рендер",2.6);
  return{cam:[3.6,2.6,5],target:[0,1.1,0],cap:"1-жұмыс"}},
 async edSketch(s,v){const b=await model("k-building-small-a");s.background=new THREE.Color("#f4f6f8");v.ground.material.color.set("#d8e6c8");
  const o=fit(b.obj,2.4);edgesOf(o);s.add(o);
  const man=grp(at(new THREE.Mesh(new THREE.CapsuleGeometry(.12,.55,6,12),MAT("#455a64")),0,.4,0),at(Sph(.11,"#455a64"),0,.86,0));man.position.set(1.7,0,1.2);man.traverse(m=>{if(m.isMesh)m.castShadow=true});s.add(man);
  return{cam:[3.8,2.8,4.4],target:[0,1,0],cap:"2-жұмыс"}},
 async edTinker(s,v){s.background=new THREE.Color("#ffffff");v.ground.visible=false;s.add(at(new THREE.Mesh(new THREE.BoxGeometry(6,.04,6),MAT("#e3ecfb")),0,-.02,0));const gh=new THREE.GridHelper(6,24,"#4a78c2","#a9c2ea");gh.position.y=.005;s.add(gh);
  const parts=[at(Box(1,1,1,PHY("#e53935",{clearcoat:.3})),0,.5,0),at(Cyl(.45,.45,.5,PHY("#fdd835")),0,1.25,0),at(Cone(.5,.7,PHY("#43a047")),0,1.85,0),at(Sph(.35,PHY("#1e88e5")),1.2,.35,.3),at(Prism(1,.8,.8,PHY("#8e24aa")),-1.3,0,.2),at(new THREE.Mesh(new THREE.TorusGeometry(.3,.12,24,48),PHY("#ff9800")),1.1,.12,-1,Math.PI/2)];
  parts.forEach(p=>{p.castShadow=true;s.add(p)});v.label(parts[0],"браузерде, онлайн",1.9);return{cam:[3.4,3.1,4.2],target:[0,.8,0],cap:"3-жұмыс",update(t){parts[3].position.y=.35+Math.abs(Math.sin(t*2))*.3}}},
 async crash(s,v){const cm=await model("car");if(!v.alive())return{};
  const wall=new THREE.Group();const brick=MAT("#b5533c",{roughness:.85});for(let r=0;r<6;r++)for(let k=0;k<6;k++){const b=new THREE.Mesh(new RoundedBoxGeometry(.4,.24,.44,2,.03),brick);b.position.set(0,.13+r*.25,-1.1+k*.45+(r%2)*.22);b.castShadow=b.receiveShadow=true;wall.add(b)}
  wall.position.x=3.4;s.add(wall);
  const car=fit(cm.obj,2.8,"len");car.rotation.y=Math.PI/2;const holder=grp(car);holder.position.x=-2.4;s.add(holder);
  const paints=[];cm.obj.traverse(o=>{if(o.isMesh)[].concat(o.material).forEach((m,i)=>{if(/^Paint 1/.test(m.name||"")){const c=m.clone();if(Array.isArray(o.material))o.material[i]=c;else o.material=c;paints.push(c)}})});
  let vel=0,state="idle";const m=v.msg("");
  v.btn("Сынақты бастау",()=>{if(state!=="idle")return;state="go";vel=2.6;m.textContent=""});
  v.btn("Қайта",()=>{state="idle";vel=0;holder.position.x=-2.4;holder.rotation.set(0,0,0);m.textContent=""});
  v.swatches(["#b71c1c","#1565c0","#2e7d32","#f9a825","#6a1b9a","#eceff1"],c=>paints.forEach(p=>p.color.set(c)));
  return{cam:[-.2,1.9,5.6],target:[.5,.55,0],cap:"Виртуалды соқтығысу сынағы",update(t,dt){
   if(state==="go"){vel+=dt*1.6;holder.position.x+=vel*dt;if(holder.position.x+1.4>=3.15){state="bounce";vel=-1.5;m.textContent="Соқтығысу! Нақты көлік бүлінген жоқ — бұл тек модель."}}
   else if(state==="bounce"){holder.position.x+=vel*dt;vel*=.95;holder.rotation.x=Math.sin(t*40)*.015*Math.abs(vel);wall.position.x=3.4+Math.sin(t*50)*.012*Math.abs(vel);if(Math.abs(vel)<.05){state="done";holder.rotation.x=0}}}}},
 axes(s,v){const o=V3(-1.1,.01,1.1);const cube=at(Box(1.6,1.6,1.6,PHY("#90caf9",{transparent:true,opacity:.8,clearcoat:1})),-.3,.8,.3);s.add(cube);
  const ax=[[[1,0,0],"#e53935","X",3.4,"x"],[[0,0,-1],"#43a047","Y",3.4,"y"],[[0,1,0],"#1e6fe0","Z (биіктік)",2.8,"z"]];
  ax.forEach(([d,c,n,L,k])=>{const dir=V3(...d);const shaft=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,L,16),MAT(c));shaft.position.copy(o).add(dir.clone().multiplyScalar(L/2));shaft.quaternion.setFromUnitVectors(V3(0,1,0),dir);
   const tip=new THREE.Mesh(new THREE.ConeGeometry(.12,.3,24),MAT(c));tip.position.copy(o).add(dir.clone().multiplyScalar(L+.12));tip.quaternion.setFromUnitVectors(V3(0,1,0),dir);s.add(shaft,tip);v.label(tip,n,.25,k)});
  s.add(at(Sph(.08,"#333"),o.x,o.y,o.z));
  return{cam:[5,3.8,6.2],target:[0,1.1,0],cap:"X, Y, Z осьтері (Blender: Z — жоғары)",update(t){cube.rotation.y=Math.sin(t*.5)*.2}}},
 cubeLab(s,v){const mat=PHY("#ff8a65",{clearcoat:1});const cube=at(Box(1.6,1.6,1.6,mat),0,.8,0);s.add(cube);
  const mk=(x,y,z)=>{const o=new THREE.Object3D();o.position.set(x,y,z);s.add(o);return o};
  v.label(mk(0,0,.9),"ұзындығы",.05);v.label(mk(.9,0,0),"ені",.05);v.label(mk(.85,.8,.85),"биіктігі",0);
  v.swatches(["#ff8a65","#4fc3f7","#81c784","#ffd54f","#ba68c8"],c=>mat.color.set(c));
  v.btn("Айналдырып көрсету",b=>{v.controls.autoRotate=!v.controls.autoRotate;v.controls.autoRotateSpeed=4;b.classList.toggle("on",v.controls.autoRotate)});
  return{cam:[3.2,2.6,3.6],target:[0,.8,0],cap:"Куб"}},
 chair(s,v){return primScene(s,v,mkChairP(),"chair",o=>{const w=fit(o,1.6,"len");w.rotation.y=-.5;return w},[2.8,2.4,3.4],"1 · Орындық")},
 house(s,v){return primScene(s,v,mkHouseP(),"k-building-small-d",o=>fit(o,2.2),[3.2,2.6,3.8],"2 · Үй")},
 car(s,v){return primScene(s,v,mkCarP(),"car",o=>fit(o,2.6,"len"),[2.8,2.2,3.6],"3 · Автокөлік")},
 apple(s,v){return primScene(s,v,mkAppleP(),null,()=>{const a=mkAppleReal();a.scale.setScalar(1.25);return a},[1.8,1.8,2.6],"4 · Алма")},
 async tower(s,v){const ns=["k-building-small-b","k-building-small-c","k-building-small-a","k-grass-trees","k-grass-trees-tall"];const M=Object.fromEntries(await Promise.all(ns.map(async n=>[n,(await model(n)).obj])));
  const g=new THREE.Group();const put=(n,x,z,ry)=>{const o=M[n].clone(true);o.position.set(x,0,z);o.rotation.y=ry||0;g.add(o)};
  put("k-building-small-c",0,0);put("k-building-small-b",1,0);put("k-building-small-a",-1,0);put("k-grass-trees",-1,1);put("k-grass-trees-tall",1,1);put("k-grass-trees-tall",0,-1);
  g.scale.setScalar(1.5);s.add(g);return{cam:[4,3.4,5.2],target:[0,1.2,0],cap:"1 · Ғимарат"}},
 async skeleton(s,v){const m=await model("skull");s.background=new THREE.Color("#e9e4da");v.ground.material.color.set("#d8d1c4");
  const bone=PHY("#efe4cf",{roughness:.55,clearcoat:.2});m.obj.traverse(o=>{if(o.isMesh){const nm=o.material.normalMap;o.material=bone.clone();o.material.normalMap=nm||null}});
  const sk=fit(m.obj,1.1);sk.position.y=1.05;s.add(sk);s.add(at(Cyl(.45,.55,1,PHY("#37474f",{clearcoat:.6})),0,.5,0));s.add(at(Cyl(.5,.5,.06,MAT("#263238",{metalness:.6})),0,1.02,0));
  return{cam:[1.5,2.1,2.4],target:[0,1.6,0],cap:"2 · Адам қаңқасы (бас сүйек)",update(t){sk.rotation.y=Math.sin(t*.5)*.6}}},
 plane(s,v){s.background=new THREE.Color("#cfe6ff");const p=mkPlane();s.add(p);return{cam:[3.6,2.4,4.8],target:[0,1.5,0],cap:"3 · Ұшақ",update(t){p.rotation.x=Math.sin(t*.8)*.1;p.position.y=1.6+Math.sin(t*1.3)*.08}}},
 keyframes(s,v){const F=48,pos=f=>V3(-3+6*f/F,.35+2*Math.abs(Math.sin(Math.PI*f/24)),0);
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.35,48,32),PHY("#ffffff",{map:ballTex(),clearcoat:1}));ball.castShadow=true;s.add(ball);
  const pts=[];for(let f=0;f<=F;f++)pts.push(pos(f));const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineDashedMaterial({color:"#7a3cf0",dashSize:.12,gapSize:.08}));line.computeLineDistances();s.add(line);
  [0,12,24,36,48].forEach(f=>{const gh=new THREE.Mesh(new THREE.SphereGeometry(.35,24,16),new THREE.MeshStandardMaterial({color:"#7a3cf0",transparent:true,opacity:.2}));gh.position.copy(pos(f));s.add(gh);v.label(gh,"кадр "+f,.45)});
  let frame=0,play=true;const pb=v.btn("Тоқтату",b=>{play=!play;b.textContent=play?"Тоқтату":"Ойнату"});
  const rg=v.range(0,F,0,x=>{frame=x;play=false;pb.textContent="Ойнату"});const m=v.msg("");
  const set=()=>{const f=Math.floor(frame);const p=pos(frame);ball.position.copy(p);ball.rotation.z=-frame*.13;const sq=p.y<.5?.8:1;ball.scale.set(1/Math.sqrt(sq),sq,1/Math.sqrt(sq));m.textContent=`Кадр: ${f} / ${F}`;rg.value=f};
  return{cam:[0,1.7,7],target:[0,1.1,0],cap:"Секірген доп: 48 кадр",update(t,dt){if(play){frame=(frame+dt*24)%(F+1)}set()}}},
 async anCartoon(s,v){const[fox,cloud,trees,pl]=await Promise.all([model("fox",true),model("k-cloud"),model("k-grass-trees-tall"),model("k-platform-grass-large-round")]);
  s.background=new THREE.Color("#bfe6ff");v.ground.material.color.set("#a5dc8f");
  const p=pl.obj;p.scale.set(1.2,.6,1.2);s.add(p);
  const f=fit(fox.obj,1);const fx=grp(f);s.add(fx);const anim=v.play(fox.obj,fox.anims,"Run");
  for(const[x,z]of[[-4,-2],[4,-2.5],[-3.5,2.5],[3.8,2]]){const t=trees.obj.clone(true);t.scale.setScalar(2);t.position.set(x,0,z);s.add(t)}
  const cls=[];for(const[x,y,z,k]of[[-3,3.6,-3,1.2],[2.6,4,-3.5,1.6],[0,4.6,-5,1]]){const c=cloud.obj.clone(true);c.scale.set(k*1.4,k*.8,k);c.position.set(x,y,z);s.add(c);cls.push(c)}
  return{cam:[0,2.6,6.4],target:[0,.8,0],cap:"1-анимация",update(t){const a=t*.9;fx.position.set(Math.cos(a)*2,.3,Math.sin(a)*2);fx.rotation.y=-a;f.rotation.y=0;cls.forEach((c,i)=>c.position.x+=Math.sin(t*.3+i)*.004)}}},
 async anGame(s,v){const[truck,coin,forest,tents,flag]=await Promise.all([model("k-vehicle-truck-red"),model("k-coin"),model("k-decoration-forest"),model("k-decoration-tents"),model("k-flag")]);
  s.background=new THREE.Color("#9fd4ff");v.ground.material.color.set("#6fbf73");
  const R=3;const road=new THREE.Mesh(new THREE.RingGeometry(R-.55,R+.55,128),MAT("#3b3f47",{roughness:.9}));road.rotation.x=-Math.PI/2;road.position.y=.02;road.receiveShadow=true;s.add(road);
  const curbT=canvasTex(512,16,(c,w,h)=>{for(let i=0;i<32;i++){c.fillStyle=i%2?"#ffffff":"#e53935";c.fillRect(i*16,0,16,h)}});curbT.wrapS=THREE.RepeatWrapping;curbT.repeat.set(4,1);
  for(const r of[R-.6,R+.6]){const c=new THREE.Mesh(new THREE.TorusGeometry(r,.07,8,160),MAT("#ffffff",{map:curbT}));c.rotation.x=Math.PI/2;c.position.y=.05;s.add(c)}
  const lane=new THREE.Mesh(new THREE.RingGeometry(R-.025,R+.025,128),new THREE.MeshBasicMaterial({color:"#ffeb3b"}));lane.rotation.x=-Math.PI/2;lane.position.y=.03;s.add(lane);
  const fo=forest.obj;fo.scale.setScalar(.38);fo.position.set(0,0,0);s.add(fo);
  const te=tents.obj;te.scale.setScalar(.4);te.position.set(-5.5,0,-3);s.add(te);const te2=tents.obj.clone(true);te2.scale.setScalar(.4);te2.position.set(5.5,0,-2.5);te2.rotation.y=Math.PI;s.add(te2);
  const fl=fit(flag.obj,1);fl.position.set(R+.9,0,0);s.add(fl);
  const tr=fit(truck.obj,.9,"len");const car=grp(tr);s.add(car);
  const coins=[];for(let i=0;i<10;i++){const k=fit(coin.obj.clone(true),.38);const a=i/10*Math.PI*2+.3;k.position.set(Math.cos(a)*R,.15,Math.sin(a)*R);k.userData={hide:0};s.add(k);coins.push(k)}
  let score=0;const lb=v.label(car,"Ұпай: 0",.9);
  return{cam:[0,6,7.2],target:[0,0,0],cap:"2-анимация",update(t,dt){const a=t*.9;car.position.set(Math.cos(a)*R,.03,Math.sin(a)*R);car.rotation.y=-a;
   coins.forEach(c=>{c.rotation.y+=dt*4;if(c.userData.hide>0){c.userData.hide-=dt;c.visible=c.userData.hide<=0}else if(car.position.distanceTo(c.position)<.5){c.userData.hide=2.5;c.visible=false;score++;lb.d.textContent="Ұпай: "+score}})}}},
 async anMed(s,v){const r=await SCN.heart(s,v);r.cap="3-анимация";return r},
 async anArch(s,v){const m=await model("tokyo",true);s.background=new THREE.Color("#ffe9d6");v.ground.material.color.set("#f3d9c4");
  const o=fit(m.obj,4.2,"max");s.add(o);v.play(m.obj,m.anims,null);v.controls.autoRotate=true;v.controls.autoRotateSpeed=1.4;
  return{cam:[4,3,4.4],target:[0,1.4,0],cap:"4-анимация"}}
};
/* ================== НАВИГАЦИЯ ================== */
const TOP=["security","security","units","units","units","ascii","ascii","editor","models","models","anim"];
const ico=i=>`img/t-${TOP[i]}.webp`;
const TOPICS={1:[{k:"security",t:"Жеке қауіпсіздік",d:"Сервистік программалар, қауіпсіздік ережелері",ls:[0,1],tint:"#e6effc",badge:"#3f74c4"},{k:"units",t:"Ақпарат өлшем бірліктері",d:"Бит, байт, КБ, МБ, ГБ — есептеу және түрлендіру",ls:[2,3,4],tint:"#ddf4f0",badge:"#1f9a8d"},{k:"ascii",t:"ASCII және Unicode",d:"Мәтінді және монохромды кескінді кодтау",ls:[5,6],tint:"#efe8fb",badge:"#7b5bd6"}],
 2:[{k:"editor",t:"3D графика редакторы",d:"2D мен 3D, модель, камера, жарық, рендеринг",ls:[7],tint:"#e6effc",badge:"#3f74c4"},{k:"models",t:"Нысандардың 3D модельдері",d:"Редакторлар, фигуралардан құрастыру, қолданылуы",ls:[8,9],tint:"#efe8fb",badge:"#7b5bd6"},{k:"anim",t:"3D анимация",d:"Кадр, қозғалыс, анимацияның салалары",ls:[10],tint:"#fdece3",badge:"#d9824f"}]};
const SCORE={};
try{const sv=JSON.parse(localStorage.getItem("inf7-prog")||"{}");Object.assign(PROG,sv.p||{});Object.assign(SCORE,sv.s||{})}catch(e){}
function saveProg(){try{localStorage.setItem("inf7-prog",JSON.stringify({p:PROG,s:SCORE}))}catch(e){}}
function renderTopics(q){const g=$("#tgrid");g.innerHTML="";TOPICS[q].forEach((T,n)=>{const c=el("article","tcard",`<span class="tnum-b">${n+1}</span><figure><img src="img/t-${T.k}.webp" alt="" width="960" height="640" loading="lazy"></figure><div class="tc-body"><h3>${T.t}</h3><p>${T.d}</p><button class="tc-btn" type="button"><span><svg><use href="#i-doc"/></svg>Тапсырманы ашу</span><svg><use href="#i-arrow"/></svg></button></div>`);c.style.setProperty("--tint",T.tint);c.style.setProperty("--badge",T.badge);
 c.querySelector(".tc-btn").onclick=()=>{openL(T.ls[0]);goWork()};g.appendChild(c)})}
function goWork(){const y=$("#work").getBoundingClientRect().top+scrollY-70;scrollTo({top:y,behavior:"smooth"})}
function refreshAch(){let tot=0,done=0,pts=0,ldone=0;LESSONS.forEach((L,i)=>{const st=lessonStats(i);tot+=st.total;done+=st.done;if(st.total&&st.done===st.total)ldone++});Object.values(SCORE).forEach(v=>pts+=v*10);
 const pct=tot?Math.round(done/tot*100):0;$("#achPct").textContent=pct+"%";$("#ringArc").style.strokeDashoffset=314.16*(1-pct/100);$("#achL").textContent=`${ldone} / ${LESSONS.length}`;$("#achT").textContent=`${done} / ${tot}`;$("#achP").textContent=pts}
let curQ=1,curL=0;
const qIds=q=>LESSONS.map((l,i)=>i).filter(i=>LESSONS[i].q===q);
const lnum=L=>L.tag.replace("-сабақ","").replace(" · 3D","");
function disposeViewers(){viewers.forEach(v=>v.dispose());viewers=[]}
function lessonStats(i){const L=LESSONS[i];let done=0,total=0;L.tasks.forEach((t,k)=>{if(t.type==="open"||t.free)return;total++;if(PROG[i+"-"+k]==="full")done++});return{done,total}}
function refreshProgress(){document.querySelectorAll(".litem").forEach(b=>{const st=lessonStats(+b.dataset.i);b.querySelector(".lprog").textContent=`${st.done}/${st.total}`;b.classList.toggle("done",st.total>0&&st.done===st.total)});
 const bar=$("#lprog");if(bar){const st=lessonStats(curL);bar.style.setProperty("--p",st.total?st.done/st.total:0);$("#lprog-t").textContent=`Толық орындалды: ${st.done} / ${st.total}`}refreshAch()}
function setQ(q,lid){curQ=q;document.body.dataset.q=q;document.querySelectorAll(".qcard").forEach(c=>c.classList.toggle("on",+c.dataset.q===q));document.querySelectorAll(".qtab").forEach(b=>{const on=+b.dataset.q===q;b.classList.toggle("on",on);b.setAttribute("aria-selected",on)});
 renderTopics(q);const ids=qIds(q);$("#side-t").textContent=q===1?"I тоқсан":"II тоқсан · 3D";$("#side-n").textContent=ids.length+" сабақ";
 const nav=$("#lessons");nav.innerHTML="";
 ids.forEach(i=>{const L=LESSONS[i];const b=el("button","litem",`<img class="licon" src="${ico(i)}" alt="" width="42" height="42"><span class="ltitle"><small>${lnum(L)}-сабақ</small>${L.t}</span><span class="lprog"></span>`);b.dataset.i=i;b.onclick=()=>{openL(i);toTop()};nav.appendChild(b)});
 openL(lid!=null?lid:ids[0])}
function toTop(){const y=$("#work").getBoundingClientRect().top+scrollY-70;if(scrollY>y)scrollTo({top:y,behavior:"smooth"})}
function openL(i){disposeViewers();curL=i;const L=LESSONS[i];const m=$("#main");
 document.querySelectorAll(".litem").forEach(b=>{const on=+b.dataset.i===i;b.classList.toggle("on",on);if(on&&b.scrollIntoView&&innerWidth<900)b.scrollIntoView({block:"nearest",inline:"center"})});
 m.innerHTML="";
 const nT=L.tasks.length,nS=L.tasks.reduce((x,t)=>x+(t.scene?t.scene.b.length:0),0);
 m.appendChild(el("header","lhead",`<div><div class="lh-top"><span class="eyebrow">${L.q===1?"I тоқсан":"II тоқсан"} · ${L.tag.replace(" · 3D","")}</span>${L.q===2?'<span class="b3d">3D</span>':""}</div><h2>${L.t}</h2><p>${L.d}</p><div class="lh-meta"><span>${nT} тапсырма</span>${nS?`<span>${nS} 3D сахна</span>`:""}</div><div class="lh-prog"><div class="bar" id="lprog"><i></i></div><span id="lprog-t"></span></div></div><img class="lh-img" src="${ico(i)}" alt="" width="960" height="640">`));
 L.tasks.forEach((t,k)=>m.appendChild(renderTask(t,k,i)));
 const ids=qIds(L.q);const pos=ids.indexOf(i);const nx=el("nav","next");
 const pv=el("button","btn ghost","← Алдыңғы сабақ");pv.style.visibility=pos===0?"hidden":"";pv.onclick=()=>{openL(ids[pos-1]);toTop()};
 const nn=el("button","btn",pos===ids.length-1?(L.q===1?"II тоқсанға өту →":"I тоқсанға оралу →"):"Келесі сабақ →");
 nn.onclick=()=>{if(pos===ids.length-1)setQ(L.q===1?2:1);else openL(ids[pos+1]);toTop()};
 nx.append(pv,nn);m.appendChild(nx);refreshProgress()}
document.querySelectorAll(".qtab").forEach(b=>b.onclick=()=>setQ(+b.dataset.q));
$("#achReset").onclick=()=>{for(const k in PROG)delete PROG[k];for(const k in SCORE)delete SCORE[k];saveProg();openL(curL)};
document.querySelectorAll(".menu a").forEach(a=>a.addEventListener("click",e=>{const n=a.dataset.nav;}));
(()=>{const links=[...document.querySelectorAll(".menu a")];const secs=[["top",$("#top")],["topics",$("#topics")],["lab",$("#lab")],["work",$("#work")]];
 const upd=()=>{let cur="top";secs.forEach(([k,e])=>{if(e.getBoundingClientRect().top<140)cur=k});links.forEach(l=>l.classList.toggle("on",l.dataset.nav===cur))};addEventListener("scroll",upd,{passive:true});upd()})();
setQ(1);

/* ================== КІРІСПЕДЕГІ 3D: ноутбук, процессор, биттер ================== */
function initHero(){
 const host=$("#hero3d");if(!host)return;
 const r=new THREE.WebGLRenderer({antialias:true,alpha:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
 host.prepend(r.domElement);
 const s=new THREE.Scene();const pm=new THREE.PMREMGenerator(r);s.environment=pm.fromScene(new RoomEnvironment(),.04).texture;pm.dispose();
 s.add(new THREE.HemisphereLight(0xffffff,0xb8c4d6,.6));
 const d=new THREE.DirectionalLight(0xffffff,1.8);d.position.set(3,7,5);d.castShadow=true;d.shadow.mapSize.set(1024,1024);const c=d.shadow.camera;c.left=c.bottom=-4;c.right=c.top=4;d.shadow.radius=6;d.shadow.bias=-.0005;s.add(d);
 const cam=new THREE.PerspectiveCamera(34,1,.1,50);cam.position.set(2.3,2.5,5.5);
 const ctl=new OrbitControls(cam,r.domElement);ctl.target.set(0,.95,-.25);ctl.enableZoom=false;ctl.enablePan=false;ctl.enableDamping=true;ctl.minPolarAngle=.6;ctl.maxPolarAngle=1.35;ctl.minAzimuthAngle=-.9;ctl.maxAzimuthAngle=1.2;const root=new THREE.Group();s.add(root);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(20,20),new THREE.ShadowMaterial({opacity:.12}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;s.add(floor);
 const alu=MAT("#c9d0da",{metalness:.75,roughness:.32});const dark=MAT("#3a4457",{roughness:.6});
 /* ноутбук */
 const lap=new THREE.Group();root.add(lap);
 const base=new THREE.Mesh(new RoundedBoxGeometry(2.6,.12,1.75,4,.05),alu);base.position.y=.06;base.castShadow=base.receiveShadow=true;lap.add(base);
 const keys=new THREE.InstancedMesh(new RoundedBoxGeometry(.15,.03,.14,2,.02),MAT("#4b566b",{roughness:.7}),13*4);let k=0;const mtx=new THREE.Matrix4();
 for(let row=0;row<4;row++)for(let col=0;col<13;col++){mtx.makeTranslation(-1.08+col*.18,.125,-.55+row*.18);keys.setMatrixAt(k++,mtx)}keys.castShadow=true;lap.add(keys);
 const space=new THREE.Mesh(new RoundedBoxGeometry(.9,.03,.14,2,.02),MAT("#4b566b",{roughness:.7}));space.position.set(0,.125,.17);lap.add(space);
 const pad=new THREE.Mesh(new RoundedBoxGeometry(.8,.01,.48,2,.005),MAT("#bcc4cf",{metalness:.6,roughness:.4}));pad.position.set(0,.122,.55);lap.add(pad);
 const hinge=new THREE.Group();hinge.position.set(0,.12,-.86);lap.add(hinge);
 const lid=new THREE.Mesh(new RoundedBoxGeometry(2.6,1.7,.07,4,.035),alu);lid.position.set(0,.85,0);lid.castShadow=true;hinge.add(lid);
 const bez=new THREE.Mesh(new THREE.PlaneGeometry(2.5,1.6),MAT("#2d3445",{roughness:.4}));bez.position.set(0,.85,.037);hinge.add(bez);
 const cv=document.createElement("canvas");cv.width=1024;cv.height=620;const g2=cv.getContext("2d");const tex=new THREE.CanvasTexture(cv);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;
 const scr=new THREE.Mesh(new THREE.PlaneGeometry(2.36,1.43),new THREE.MeshBasicMaterial({map:tex,toneMapped:false}));scr.position.set(0,.86,.039);hinge.add(scr);
 hinge.rotation.x=-.18;
 const code=[["#8a94a8","# Ақпарат өлшемі"],["#4a6fa5","бит"," = 8"],["#4a6fa5","байт"," = 1"],["",""],["#4f8c86","def ","кб_байтқа","(кб):"],["#283142","    return кб * 1024"],["",""],["#283142","print(","кб_байтқа(2)",")"],["#3d8a5c","→ 2048"]];
 const full=code.map(l=>l.slice(1).join(""));const total=full.reduce((a,l)=>a+l.length,0);
 function draw(n){const W=cv.width,H=cv.height;g2.fillStyle="#fbfcfe";g2.fillRect(0,0,W,H);g2.fillStyle="#eef2f8";g2.fillRect(0,0,W,52);
  [["#e9a39b",28],["#ebcf8c",54],["#a9cfa4",80]].forEach(([cc,x])=>{g2.fillStyle=cc;g2.beginPath();g2.arc(x,26,8,0,7);g2.fill()});
  g2.fillStyle="#6b7487";g2.font="500 22px 'Noto Sans Mono',monospace";g2.fillText("өлшем.py",120,34);
  g2.fillStyle="#f2f4f8";g2.fillRect(0,52,64,H);let left=n;
  code.forEach((l,i)=>{const y=112+i*58;g2.fillStyle="#a7aebb";g2.font="500 24px 'Noto Sans Mono',monospace";g2.fillText(String(i+1),20,y);
   let x=88;const parts=l.slice(1);parts.forEach((t,j)=>{if(left<=0)return;const show=t.slice(0,left);left-=t.length;g2.fillStyle=j===0&&l[0]?l[0]:"#283142";g2.font="500 38px 'Noto Sans Mono',monospace";g2.fillText(show,x,y);x+=g2.measureText(show).width});
   if(left<=0&&left>-full[i].length-1&&Math.floor(performance.now()/450)%2){g2.fillStyle="#4a6fa5";g2.fillRect(x+2,y-26,3,32)}});
  tex.needsUpdate=true}
 /* процессор */
 const chip=new THREE.Group();const body=new THREE.Mesh(new RoundedBoxGeometry(.8,.12,.8,3,.03),MAT("#46506a",{roughness:.45,metalness:.2}));body.castShadow=true;chip.add(body);
 const top=new THREE.Mesh(new RoundedBoxGeometry(.5,.03,.5,2,.01),MAT("#d7dce4",{metalness:.9,roughness:.25}));top.position.y=.07;chip.add(top);
 const pinG=new RoundedBoxGeometry(.05,.03,.12,1,.01),pinM=MAT("#c8a96a",{metalness:.95,roughness:.3});
 for(let i=0;i<6;i++)for(const sd of[-1,1]){const a=new THREE.Mesh(pinG,pinM);a.position.set(-.3+i*.12,-.02,sd*.46);chip.add(a);const b=new THREE.Mesh(pinG,pinM);b.rotation.y=Math.PI/2;b.position.set(sd*.46,-.02,-.3+i*.12);chip.add(b)}
 chip.position.set(-1.45,1.75,-.2);chip.rotation.set(.5,.4,-.25);root.add(chip);
 /* бит-текшелер */
 const bitTex=t=>{const cc=document.createElement("canvas");cc.width=cc.height=128;const x=cc.getContext("2d");x.fillStyle="#fff";x.fillRect(0,0,128,128);x.fillStyle="#283142";x.font="600 74px 'Noto Sans Mono',monospace";x.textAlign="center";x.textBaseline="middle";x.fillText(t,64,70);const tt=new THREE.CanvasTexture(cc);tt.colorSpace=THREE.SRGBColorSpace;return tt};
 const t0=bitTex("0"),t1=bitTex("1");const cols=["#dfe8f5","#dcefec","#f3ead9","#e9e3f3"];const bits=[];
 [[1.7,1.5,.2,"1"],[1.25,2.2,-.7,"0"],[1.9,.75,-.6,"1"],[-1.1,2.3,-.9,"0"],[-1.7,.6,.4,"1"],[.5,2.45,.5,"0"]].forEach(([x,y,z,b],i)=>{
  const m=new THREE.Mesh(new RoundedBoxGeometry(.36,.36,.36,3,.07),new THREE.MeshStandardMaterial({color:cols[i%4],map:b==="1"?t1:t0,roughness:.5}));m.position.set(x,y,z);m.castShadow=true;m.userData={y,ph:i*1.3};root.add(m);bits.push(m)});
 /* бұлт/желі сызығы */
 const ring=new THREE.Mesh(new THREE.TorusGeometry(2,.014,8,160),MAT("#c9a25a",{metalness:.9,roughness:.25}));ring.rotation.x=Math.PI/2;ring.position.y=.02;root.add(ring);
 const dots=[];for(let i=0;i<3;i++){const dd=new THREE.Mesh(new THREE.SphereGeometry(.06,16,12),MAT(["#24508f","#7b5bd6","#c9a25a"][i],{roughness:.25,metalness:.3}));root.add(dd);dots.push(dd)}
 const clk=new THREE.Clock();let vis=true,tt=0,lastDraw=0;
 new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(host);
 const post=makeComposer(r,cam,{radius:.3,k:.8});if(post)post.setScene(s);
 const home=()=>{const k=Math.pow(Math.max(1,1.45/cam.aspect),.75);return new THREE.Vector3(3.6,2.3,3.1).sub(new THREE.Vector3(0,1.1,0)).multiplyScalar(k).add(new THREE.Vector3(0,1.1,0))};let first=true;
 const rs=()=>{const W=host.clientWidth,H=host.clientHeight;r.setSize(W,H);if(post)post.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix();if(first&&W){first=false;cam.position.copy(home())}};new ResizeObserver(rs).observe(host);rs();
 const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
 (function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05);if(!vis)return;tt+=reduce?0:dt;
  if(tt-lastDraw>.06||lastDraw===0){lastDraw=tt;const cyc=(tt*14)%(total+40);draw(reduce?total:Math.floor(Math.min(cyc,total)))}
  bits.forEach(b=>{b.position.y=b.userData.y+Math.sin(tt*1.2+b.userData.ph)*.12;b.rotation.y=tt*.5+b.userData.ph;b.rotation.x=Math.sin(tt*.7+b.userData.ph)*.3});
  root.rotation.y=Math.sin(tt*.35)*.22;chip.position.y=1.6+Math.sin(tt*1.1)*.08;chip.rotation.y=.4+Math.sin(tt*.5)*.25;
  dots.forEach((dd,i)=>{const a=tt*.6+i*2.1;dd.position.set(Math.cos(a)*2,.07,Math.sin(a)*2)});
  ctl.update();if(post)post.c.render(dt);else r.render(s,cam)})();
}
try{initHero()}catch(e){console.error(e)}

/* ================== КІРІСПЕ ФОНЫ: баспа плата өрнегі ================== */
function initIntroBg(){
 const cv=$("#introbg");if(!cv)return;const sec=cv.parentElement;
 function rnd(seed){return()=>{seed=(seed*16807)%2147483647;return(seed-1)/2147483646}}
 function draw(){const dpr=Math.min(devicePixelRatio,2),W=sec.clientWidth,H=sec.clientHeight;cv.width=W*dpr;cv.height=H*dpr;const g=cv.getContext("2d");g.scale(dpr,dpr);g.clearRect(0,0,W,H);
  const R=rnd(7);const step=24;const cols=["rgba(74,111,165,","rgba(79,140,134,","rgba(150,128,90,"];
  const fade=x=>Math.min(1,Math.max(.25,(x/W-.05)*1.4));/* мәтін тұрған сол жақта әлсіз, оңға қарай айқынырақ */
  g.lineCap="round";g.lineJoin="round";
  for(let i=0;i<70;i++){let x=Math.round(R()*W/step)*step,y=Math.round(R()*H/step)*step;const c=cols[i%7===0?2:i%3===0?1:0];const a=(.12+R()*.16)*fade(x);
   g.strokeStyle=c+a+")";g.lineWidth=1.4+R()*.8;g.beginPath();g.moveTo(x,y);g.fillStyle=c+(a*1.4)+")";
   const segs=2+Math.floor(R()*4);let dir=Math.floor(R()*4);
   for(let k=0;k<segs;k++){const len=step*(2+Math.floor(R()*6));const d=[[1,0],[0,1],[-1,0],[0,-1]][dir];
    if(R()<.5){const dg=Math.min(len,step*2);x+=d[0]*dg+(d[1]?step*2*(R()<.5?1:-1):0)*0;y+=d[1]*dg;g.lineTo(x,y);const s2=R()<.5?1:-1;x+=(d[0]?d[0]*step:s2*step);y+=(d[1]?d[1]*step:s2*step);g.lineTo(x,y)}
    else{x+=d[0]*len;y+=d[1]*len;g.lineTo(x,y)}
    dir=(dir+(R()<.5?1:3))%4}
   g.stroke();g.beginPath();g.arc(x,y,3.2,0,7);g.fill();g.strokeStyle=c+(a*1.6)+")";g.lineWidth=1.2;g.beginPath();g.arc(x,y,6,0,7);g.stroke()}
  for(let i=0;i<7;i++){const x=Math.round((W*.35+R()*W*.65)/step)*step,y=Math.round(R()*H/step)*step,w=step*(2+Math.floor(R()*2)),h=step*2;const a=.10*fade(x);
   g.fillStyle="rgba(255,255,255,.6)";g.strokeStyle="rgba(74,111,165,"+(a*1.8)+")";g.lineWidth=1.4;g.beginPath();g.roundRect(x-w/2,y-h/2,w,h,6);g.fill();g.stroke();
   g.strokeStyle="rgba(74,111,165,"+a*1.5+")";for(let k=-w/2+8;k<=w/2-8;k+=8){g.beginPath();g.moveTo(x+k,y-h/2);g.lineTo(x+k,y-h/2-6);g.moveTo(x+k,y+h/2);g.lineTo(x+k,y+h/2+6);g.stroke()}}
  g.font="600 13px 'Noto Sans Mono',monospace";for(let i=0;i<26;i++){const x=W*.3+R()*W*.7,y=R()*H;g.fillStyle="rgba(74,111,165,"+(.08+R()*.1)*fade(x)+")";g.fillText(R()<.5?"0":"1",x,y)}
  const gl=g.createRadialGradient(W*.85,H*.35,10,W*.85,H*.35,W*.45);gl.addColorStop(0,"rgba(255,255,255,.65)");gl.addColorStop(1,"rgba(255,255,255,0)");g.fillStyle=gl;g.fillRect(0,0,W,H)}
 let t;new ResizeObserver(()=>{clearTimeout(t);t=setTimeout(draw,60)}).observe(sec);draw();
 document.fonts&&document.fonts.ready.then(draw)}
try{initIntroBg()}catch(e){console.error(e)}

/* ================== 3D ЗЕРТХАНА: ЖҮЙЕЛІК БЛОКТЫҢ ІШІНДЕ ================== */
const PC_INFO={
 case:{n:"Корпус (жүйелік блоктың қабы)",d:"Барлық бөлшекті бір жерге бекітіп, оларды шаң мен соққыдан қорғайды. Алдыңғы торы арқылы салқын ауа кіреді.",f:"Бұл — ATX форматындағы «midi-tower» корпус: биіктігі шамамен 47 см."},
 glass:{n:"Шыны бүйір панелі",d:"Шыңдалған шыныдан жасалған қақпақ: ішіндегі бөлшектерді көруге мүмкіндік береді.",f:"Компьютерді жинағанда алдымен осы панель алынады."},
 mb:{n:"Аналық тақта",d:"Компьютердің негізгі тақтасы: процессор, жад, бейнекарта, дискілер мен порттардың бәрі осыған қосылып, бір-бірімен деректер алмасады.",f:"ATX тақтасының өлшемі — 30,5 × 24,4 см. Ондағы жіңішке мыс жолдар — деректер мен ток жүретін «жолдар»."},
 cpu:{n:"Процессор (CPU)",d:"Компьютердің «миы»: программалардың командаларын орындап, есептеулер жүргізеді.",f:"Қазіргі процессор секундына миллиардтаған операция жасайды: жиілігі 5 ГГц-ке дейін, ядросы 8–16."},
 cooler:{n:"Процессор салқындатқышы",d:"Процессордың жылуын мыс жылу құбырлары арқылы алюминий радиаторға өткізеді, ал желдеткіш оны ауаға үрлеп шығарады.",f:"Салқындатқышсыз процессор бірнеше секундта 100 °C-қа дейін қызып, өзін-өзі өшіреді."},
 ram:{n:"Жедел жад (RAM)",d:"Қазір ашық тұрған программалар мен деректер уақытша сақталатын жылдам жад. Компьютер өшсе, ондағы ақпарат өшеді.",f:"Мұнда 2 × 16 ГБ DDR5 модулі тұр. Жедел жад дискіден жүздеген есе жылдам."},
 gpu:{n:"Бейнекарта (GPU)",d:"Экранға шығатын кескінді, 3D графиканы, ойын мен видеоны өңдейді. Жасанды интеллектті оқытуда да қолданылады.",f:"Бейнекартаның мыңдаған шағын ядросы бір мезгілде жұмыс істейді."},
 psu:{n:"Қоректендіру блогы (PSU)",d:"Розеткадағы 220 В айнымалы токты бөлшектерге керек 12 В, 5 В және 3,3 В тұрақты токқа айналдырады.",f:"Бұл блоктың қуаты — 750 Вт. «80+ Gold» белгісі оның энергияны үнемді жұмсайтынын білдіреді."},
 nvme:{n:"M.2 NVMe SSD",d:"Аналық тақтаға тікелей орнатылатын өте жылдам жинақтағыш. Операциялық жүйе мен программалар осында сақталады.",f:"Жылдамдығы секундына 7000 МБ-қа дейін: 1 ГБ файлды бір секундқа жетпей көшіреді."},
 ssd:{n:"SATA SSD (2,5 дюйм)",d:"Қозғалмалы бөлігі жоқ, флеш-жадқа негізделген жинақтағыш. HDD-ден жылдам әрі тыныш.",f:"Жылдамдығы шамамен 550 МБ/с."},
 hdd:{n:"Қатқыл диск (HDD)",d:"Деректерді айналып тұрған магниттік дискілерге жазады. Көлемі үлкен әрі арзан, бірақ SSD-ден баяу.",f:"Ішіндегі дискілер минутына 7200 рет айналады. Көлемі — 2 ТБ."},
 fans:{n:"Корпус желдеткіштері",d:"Алдыңғы желдеткіштер салқын ауаны ішке кіргізеді, артқысы ыстық ауаны сыртқа шығарады.",f:"Желдеткіштің диаметрі — 120 мм. Ауа алдынан артқа қарай ағады."},
 cables:{n:"Қуат кабельдері",d:"Қоректендіру блогынан аналық тақтаға (24 pin), процессорға (8 pin) және бейнекартаға ток жеткізеді.",f:"24 pin — аналық тақтаның негізгі қуат кабелі."},
 cmos:{n:"CMOS батарейкасы",d:"Компьютер өшіп тұрғанда сағат пен BIOS баптауларын сақтап тұрады.",f:"Әдетте CR2032 үлгісіндегі 3 В батарейка, 5–10 жыл жұмыс істейді."},
 io:{n:"Артқы порттар (I/O)",d:"USB, HDMI, желі (LAN) және дыбыс порттары: тінтуір, пернетақта, монитор мен интернет осы жерге қосылады.",f:"Порттардың үстіндегі металл қақпақ оларды электр бөгеттерінен қорғайды."}
};
const PC_ORDER=["case","glass","mb","cpu","cooler","ram","gpu","psu","nvme","ssd","hdd","fans","cables","cmos","io"];

function txtTex(w,h,draw){const c=document.createElement("canvas");c.width=w;c.height=h;const x=c.getContext("2d");draw(x,w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
function labelPlane(w,h,draw,opts){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshStandardMaterial(Object.assign({map:txtTex(Math.round(512*w/Math.max(w,h)),Math.round(512*h/Math.max(w,h)),draw),transparent:true,roughness:.6,metalness:.1},opts||{})));return m}
const SM=(c,o)=>new THREE.MeshPhysicalMaterial(Object.assign({color:c,roughness:.45,metalness:.2,clearcoat:.2,clearcoatRoughness:.4},o||{}));
function rbox(w,h,d,mat,r){const m=new THREE.Mesh(new RoundedBoxGeometry(w,h,d,3,r??Math.min(w,h,d)*.15),mat);m.castShadow=m.receiveShadow=true;return m}
function cyl(r1,r2,h,mat,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,seg||32),mat);m.castShadow=m.receiveShadow=true;return m}
function place(m,x,y,z,rx,ry,rz){m.position.set(x,y,z);if(rx||ry||rz)m.rotation.set(rx||0,ry||0,rz||0);return m}

/* желдеткіш: Z осіне қарайды */
function mkPcFan(size,ringMats){const g=new THREE.Group();const s=size,half=s/2,rad=s*.47;
 const sh=new THREE.Shape();const rr=s*.08;sh.moveTo(-half+rr,-half);sh.lineTo(half-rr,-half);sh.quadraticCurveTo(half,-half,half,-half+rr);sh.lineTo(half,half-rr);sh.quadraticCurveTo(half,half,half-rr,half);sh.lineTo(-half+rr,half);sh.quadraticCurveTo(-half,half,-half,half-rr);sh.lineTo(-half,-half+rr);sh.quadraticCurveTo(-half,-half,-half+rr,-half);
 const hole=new THREE.Path();hole.absarc(0,0,rad,0,Math.PI*2,true);sh.holes.push(hole);
 const fg=new THREE.ExtrudeGeometry(sh,{depth:s*.2,bevelEnabled:true,bevelThickness:.004,bevelSize:.004,bevelSegments:2,curveSegments:48});fg.translate(0,0,-s*.1);
 const frame=new THREE.Mesh(fg,SM("#1b1f27",{roughness:.55,metalness:.1}));frame.castShadow=true;g.add(frame);
 const rotor=new THREE.Group();const hub=cyl(s*.15,s*.15,s*.16,SM("#20242c",{roughness:.35}),40);hub.rotation.x=Math.PI/2;rotor.add(hub);
 const cap=new THREE.Mesh(new THREE.CircleGeometry(s*.13,40),SM("#2a2f39",{metalness:.6,roughness:.3}));cap.position.z=s*.081;rotor.add(cap);
 const bladeShape=new THREE.Shape();bladeShape.moveTo(0,-s*.06);bladeShape.quadraticCurveTo(s*.2,-s*.1,s*.33,-s*.02);bladeShape.quadraticCurveTo(s*.3,s*.08,s*.18,s*.09);bladeShape.quadraticCurveTo(s*.08,s*.08,0,s*.05);bladeShape.closePath();
 const bg=new THREE.ExtrudeGeometry(bladeShape,{depth:.004,bevelEnabled:false,curveSegments:16});
 const bm=new THREE.MeshPhysicalMaterial({color:"#e8eef8",roughness:.35,transmission:.35,thickness:.01,transparent:true,opacity:.95});
 for(let i=0;i<7;i++){const piv=new THREE.Group();const b=new THREE.Mesh(bg,bm);b.position.x=s*.12;b.rotation.x=.45;b.castShadow=true;piv.add(b);piv.rotation.z=i/7*Math.PI*2;rotor.add(piv)}
 g.add(rotor);
 if(ringMats){const ring=new THREE.Mesh(new THREE.TorusGeometry(rad*.985,s*.012,10,96),ringMats);ring.position.z=s*.1;g.add(ring);const ring2=ring.clone();ring2.position.z=-s*.1;g.add(ring2)}
 for(const[x,y]of[[-1,-1],[1,-1],[1,1],[-1,1]]){const scr=cyl(s*.025,s*.025,s*.21,SM("#3b414d",{metalness:.8,roughness:.3}),16);scr.rotation.x=Math.PI/2;scr.position.set(x*(half-s*.07),y*(half-s*.07),0);g.add(scr)}
 g.userData.rotor=rotor;return g}

function pcbTexture(){return txtTex(1024,1280,(x,W,H)=>{
 const g=x.createLinearGradient(0,0,W,H);g.addColorStop(0,"#1b2230");g.addColorStop(1,"#141a25");x.fillStyle=g;x.fillRect(0,0,W,H);
 x.globalAlpha=.55;x.strokeStyle="#2f3d55";x.lineWidth=2;
 for(let i=0;i<260;i++){let px=Math.random()*W,py=Math.random()*H;x.beginPath();x.moveTo(px,py);const n=2+Math.random()*3|0;for(let k=0;k<n;k++){if(Math.random()<.5)px+=(Math.random()-.5)*260;else py+=(Math.random()-.5)*260;x.lineTo(px,py)}x.stroke()}
 x.globalAlpha=1;x.fillStyle="#3a4a66";for(let i=0;i<500;i++){x.fillRect(Math.random()*W,Math.random()*H,3,3)}
 x.fillStyle="#c9a25a";[[40,40],[W-40,40],[40,H-40],[W-40,H-40],[W/2,40],[W/2,H-40],[40,H/2],[W-40,H/2]].forEach(([a,b])=>{x.beginPath();x.arc(a,b,16,0,7);x.fill();x.fillStyle="#141a25";x.beginPath();x.arc(a,b,8,0,7);x.fill();x.fillStyle="#c9a25a"});
 x.fillStyle="rgba(230,236,245,.85)";x.font="600 26px 'Noto Sans Mono',monospace";
 const t=(s,a,b)=>x.fillText(s,a,b);t("CPU_FAN",560,120);t("DIMM_A1  DIMM_A2  DIMM_B1  DIMM_B2",40,470);t("PCIE_X16_1",420,690);t("M.2_1",420,560);t("PCIE_X16_2",420,1060);t("SATA6G",60,1030);t("ATX_24P",40,250);t("BIOS",540,880);t("CMOS",600,820);
 x.font="800 44px 'Montserrat',sans-serif";x.fillStyle="rgba(201,162,90,.9)";t("INFORMATIKA 7",170,880);x.font="500 22px 'Noto Sans Mono',monospace";x.fillStyle="rgba(200,210,225,.7)";t("ATX · DDR5 · PCIe 5.0",180,915)})}

function buildPC(){
 const root=new THREE.Group();const parts={};const rgbMats=[];
 const rgb=()=>{const m=new THREE.MeshStandardMaterial({color:"#000",emissive:"#5aa0ff",emissiveIntensity:1.3,roughness:.4});rgbMats.push(m);return m};
 const part=(key,info,delta,stage,obj)=>{const g=obj||new THREE.Group();g.userData.part=key;g.userData.info=info||key;g.userData.base=g.position.clone();g.userData.delta=new THREE.Vector3(...delta);g.userData.stage=stage;g.userData.off=new THREE.Vector3();root.add(g);(parts[key]=parts[key]||[]).push(g);return g};
 /* корпус */
 const caseM=SM("#2a2f38",{metalness:.55,roughness:.38});const caseIn=SM("#1d2129",{metalness:.3,roughness:.6});
 const CASE=part("case","case",[0,0,0],[0,1]);
 const meshTex=txtTex(512,512,(x,W,H)=>{x.fillStyle="#fff";x.fillRect(0,0,W,H);x.fillStyle="#000";const r=9;for(let j=0;j<40;j++)for(let i=0;i<40;i++){const cx=i*14+(j%2)*7,cy=j*12.2;x.beginPath();for(let k=0;k<6;k++){const a=k/6*Math.PI*2+Math.PI/6;x.lineTo(cx+Math.cos(a)*r*.62,cy+Math.sin(a)*r*.62)}x.fill()}});meshTex.colorSpace=THREE.NoColorSpace;meshTex.wrapS=meshTex.wrapT=THREE.RepeatWrapping;
 const meshM=(rx,ry)=>{const t=meshTex.clone();t.repeat.set(rx,ry);t.needsUpdate=true;return new THREE.MeshStandardMaterial({color:"#2a2f38",metalness:.6,roughness:.4,alphaMap:t,transparent:true,side:THREE.DoubleSide,alphaTest:.4})};
 CASE.add(place(rbox(1.1,.03,2.26,caseM,.012),0,.015,0));
 const top=new THREE.Mesh(new THREE.BoxGeometry(1.06,.02,2.2),meshM(2,4));top.position.set(0,2.35,0);CASE.add(top);
 CASE.add(place(rbox(1.1,.03,.04,caseM,.01),0,2.355,1.11),place(rbox(1.1,.03,.04,caseM,.01),0,2.355,-1.11));
 CASE.add(place(rbox(.03,2.36,2.26,caseIn,.01),-.535,1.18,0));
 const back=new THREE.Group();back.add(place(rbox(1.1,2.36,.03,caseM,.01),0,1.18,-1.12));
 const rearMesh=new THREE.Mesh(new THREE.CircleGeometry(.27,48),meshM(1,1));rearMesh.position.set(0,1.95,-1.104);rearMesh.rotation.y=Math.PI;back.add(rearMesh);CASE.add(back);
 for(let i=0;i<7;i++)CASE.add(place(rbox(.12,.035,.02,SM("#3b414d",{metalness:.7}),.004),.05,1.36-i*.07,-1.135));
 const front=new THREE.Mesh(new THREE.BoxGeometry(1.08,2.3,.025),[caseM,caseM,caseM,caseM,meshM(2,4),caseM]);front.position.set(0,1.18,1.12);CASE.add(front);
 CASE.add(place(rbox(1.1,.06,.06,caseM,.02),0,2.34,1.12),place(rbox(1.1,.06,.06,caseM,.02),0,.03,1.12));
 const pwr=cyl(.025,.025,.012,new THREE.MeshStandardMaterial({color:"#111",emissive:"#4fc3f7",emissiveIntensity:1.5}),24);pwr.rotation.x=Math.PI/2;pwr.position.set(.35,2.37,.95);pwr.rotation.set(0,0,0);CASE.add(pwr);
 for(const x of[-.42,.42])for(const z of[-.95,.95])CASE.add(place(cyl(.06,.07,.04,SM("#111",{roughness:.8}),24),x,-.02,z));
 CASE.add(place(rbox(.03,2.3,.03,caseM,.008),.535,1.18,1.11),place(rbox(.03,2.3,.03,caseM,.008),.535,1.18,-1.11),place(rbox(.03,.03,2.24,caseM,.008),.535,2.33,0),place(rbox(.03,.03,2.24,caseM,.008),.535,.03,0));
 /* PSU қақпағы (shroud) */
 const shM=SM("#252a33",{metalness:.5,roughness:.45});
 CASE.add(place(rbox(1.04,.025,1.3,shM,.008),0,.565,.45),place(rbox(.025,.55,1.3,shM,.008),.5,.29,.45));
 const shLogo=labelPlane(.6,.12,(x,W,H)=>{x.fillStyle="#c9a25a";x.font=`800 ${H*.6}px Montserrat,sans-serif`;x.textAlign="center";x.textBaseline="middle";x.fillText("INFORMATIKA 7",W/2,H/2)});shLogo.position.set(.514,.32,.5);shLogo.rotation.y=Math.PI/2;CASE.add(shLogo);
 /* шыны */
 const glass=new THREE.Mesh(new RoundedBoxGeometry(.02,2.3,2.2,2,.008),new THREE.MeshPhysicalMaterial({color:"#cfe3ff",metalness:0,roughness:.04,transmission:.92,thickness:.02,ior:1.5,transparent:true,opacity:.35,envMapIntensity:1.2}));
 glass.position.set(.56,1.18,0);const GL=part("glass","glass",[1.4,0,0],[0,.25],new THREE.Group());GL.add(glass);
 /* аналық тақта */
 const MB=part("mb","mb",[.55,0,0],[.62,1]);
 const pcbM=new THREE.MeshStandardMaterial({map:pcbTexture(),roughness:.7,metalness:.15});const edge=SM("#141a25");
 const pcb=new THREE.Mesh(new THREE.BoxGeometry(.025,1.52,1.22),[pcbM,edge,edge,edge,edge,edge]);pcb.position.set(-.505,1.5,-.43);pcb.castShadow=pcb.receiveShadow=true;MB.add(pcb);
 const hsM=SM("#3a404c",{metalness:.85,roughness:.32});const accent=SM("#c9a25a",{metalness:.9,roughness:.25});
 const vrm1=new THREE.Group();vrm1.add(rbox(.11,.12,.46,hsM,.015));for(let i=0;i<9;i++)vrm1.add(place(rbox(.115,.012,.46,hsM,.004),0,-.05+i*.0125+.0,0));vrm1.add(place(rbox(.005,.02,.4,accent,.003),.058,.04,0));vrm1.position.set(-.44,2.14,-.62);MB.add(vrm1);
 const vrm2=new THREE.Group();vrm2.add(rbox(.11,.46,.12,hsM,.015));vrm2.add(place(rbox(.005,.4,.02,accent,.003),.058,0,.04));vrm2.position.set(-.44,1.86,-.9);MB.add(vrm2);
 const IO=part("io","io",[.5,.1,0],[.62,1]);const ioc=rbox(.13,.55,.15,SM("#2b313b",{metalness:.7,roughness:.35}),.02);ioc.position.set(-.425,1.9,-.97);IO.add(ioc);
 const ioLbl=labelPlane(.5,.13,(x,W,H)=>{x.fillStyle="#c9a25a";x.font=`700 ${H*.45}px Montserrat,sans-serif`;x.textAlign="center";x.textBaseline="middle";x.fillText("I/O · USB · HDMI · LAN",W/2,H/2)});ioLbl.position.set(-.358,1.9,-.97);ioLbl.rotation.set(0,Math.PI/2,Math.PI/2);IO.add(ioLbl);
 for(let i=0;i<5;i++){IO.add(place(rbox(.05,.06,.02,SM("#4a78c2",{metalness:.3}),.008),-.44,1.72+i*.09,-1.11))}
 MB.add(place(rbox(.012,.32,.32,SM("#b9c0cb",{metalness:.9,roughness:.25}),.01),-.488,1.88,-.55));
 const dimmM=SM("#2b2f37",{roughness:.6});for(let i=0;i<4;i++)MB.add(place(rbox(.04,.7,.03,dimmM,.006),-.475,1.85,-.2+i*.06));
 const slotM=SM("#2b2f37",{roughness:.6}),steel=SM("#cfd5de",{metalness:.95,roughness:.22});
 MB.add(place(rbox(.045,.04,.5,steel,.008),-.47,1.43,-.62),place(rbox(.045,.04,.5,steel,.008),-.47,.97,-.62),place(rbox(.04,.035,.16,slotM,.006),-.475,1.2,-.79));
 const chip=new THREE.Group();chip.add(rbox(.04,.26,.26,hsM,.03));chip.add(place(labelPlane(.2,.2,(x,W,H)=>{x.fillStyle="#c9a25a";x.lineWidth=10;x.strokeStyle="#c9a25a";x.beginPath();x.moveTo(W/2,20);x.lineTo(W-20,H/2);x.lineTo(W/2,H-20);x.lineTo(20,H/2);x.closePath();x.stroke();x.font=`800 ${H*.16}px Montserrat`;x.textAlign="center";x.textBaseline="middle";x.fillText("I7",W/2,H/2)}),.021,0,0,0,Math.PI/2,0));chip.position.set(-.47,1.06,-.12);MB.add(chip);
 const atx=new THREE.Group();atx.add(rbox(.07,.33,.06,SM("#e9ecf1",{roughness:.6}),.008));for(let i=0;i<12;i++)for(let j=0;j<2;j++)atx.add(place(rbox(.02,.02,.02,SM("#20242c"),.004),.03,-.15+i*.027,-.013+j*.026));atx.position.set(-.465,1.75,.14);MB.add(atx);
 for(let i=0;i<4;i++)MB.add(place(rbox(.04,.05,.04,SM("#e9ecf1",{roughness:.6}),.006),-.475,.92+i*.065,.15));
 for(let i=0;i<14;i++)MB.add(place(cyl(.018,.018,.05,SM("#1d222b",{metalness:.7,roughness:.3}),16),-.47,2.0-((i%7)*.035),-.72+Math.floor(i/7)*.04,0,0,Math.PI/2));
 const CM=part("cmos","cmos",[.6,-.1,.2],[.62,1]);const bat=cyl(.05,.05,.012,SM("#d8dde4",{metalness:.95,roughness:.2}),40);bat.rotation.z=Math.PI/2;bat.position.set(-.488,1.25,-.32);CM.add(bat);
 /* процессор */
 const CPU=part("cpu","cpu",[1.05,.3,0],[.45,.9]);const sub=rbox(.008,.24,.24,SM("#2e6b45",{roughness:.6}),.004);sub.position.set(-.478,1.88,-.55);CPU.add(sub);
 const ihs=rbox(.016,.19,.19,SM("#d4d9e0",{metalness:.95,roughness:.2}),.012);ihs.position.set(-.466,1.88,-.55);CPU.add(ihs);
 const cpuL=labelPlane(.16,.16,(x,W,H)=>{x.fillStyle="#3a4457";x.textAlign="center";x.font=`800 ${H*.17}px Montserrat`;x.fillText("CPU",W/2,H*.42);x.font=`500 ${H*.09}px 'Noto Sans Mono',monospace`;x.fillText("8 CORES · 5.0 GHz",W/2,H*.62);x.fillText("INF-7  ◆",W/2,H*.76)},{transparent:true});cpuL.position.set(-.4575,1.88,-.55);cpuL.rotation.y=Math.PI/2;CPU.add(cpuL);
 /* салқындатқыш */
 const CO=part("cooler","cooler",[1.35,.25,0],[.25,.7]);const cu=SM("#c47a45",{metalness:1,roughness:.28});
 CO.add(place(rbox(.05,.22,.22,cu,.01),-.432,1.88,-.55));
 const finG=new THREE.BoxGeometry(.6,.56,.0045),finM=SM("#c9ced6",{metalness:1,roughness:.3});const fins=new THREE.InstancedMesh(finG,finM,40);const mm=new THREE.Matrix4();for(let i=0;i<40;i++){mm.makeTranslation(.06,1.88,-.7+i*.0075);fins.setMatrixAt(i,mm)}fins.castShadow=fins.receiveShadow=true;CO.add(fins);
 for(let i=0;i<4;i++){const z=-.64+i*.06,y=1.83+(i%2)*.1;const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.43,1.88+(i-1.5)*.04,z),new THREE.Vector3(-.3,y,z),new THREE.Vector3(.33,y,z)]);const tp=new THREE.Mesh(new THREE.TubeGeometry(curve,40,.016,12),cu);tp.castShadow=true;CO.add(tp);const tip=cyl(.017,.017,.02,cu,12);tip.rotation.z=Math.PI/2;tip.position.set(.37,y,z);CO.add(tip)}
 const capT=new THREE.Group();capT.add(rbox(.035,.58,.34,SM("#1f242c",{metalness:.7,roughness:.3}),.02));capT.add(place(labelPlane(.3,.08,(x,W,H)=>{x.fillStyle="#c9a25a";x.font=`800 ${H*.6}px Montserrat`;x.textAlign="center";x.textBaseline="middle";x.fillText("FROST 120",W/2,H/2)}),.0185,0,0,0,Math.PI/2,0));capT.position.set(.38,1.88,-.55);CO.add(capT);
 const cfan=mkPcFan(.58,rgb());cfan.position.set(.06,1.88,-.36);CO.add(cfan);
 /* жедел жад */
 const RAM=part("ram","ram",[1.0,.35,0],[.3,.72]);
 for(const z of[-.14,-.02]){const st=new THREE.Group();st.add(rbox(.16,.66,.012,SM("#24563c"),.004));const hs=SM("#262b34",{metalness:.8,roughness:.3});st.add(place(rbox(.17,.67,.008,hs,.004),.005,0,.011),place(rbox(.17,.67,.008,hs,.004),.005,0,-.011));
  st.add(place(rbox(.03,.64,.03,rgb(),.01),.1,0,0));const l=labelPlane(.12,.5,(x,W,H)=>{x.save();x.translate(W/2,H/2);x.rotate(-Math.PI/2);x.fillStyle="#c9a25a";x.font=`800 ${W*.28}px Montserrat`;x.textAlign="center";x.textBaseline="middle";x.fillText("DDR5 16GB",0,-W*.12);x.fillStyle="#aab3c2";x.font=`500 ${W*.16}px 'Noto Sans Mono'`;x.fillText("6000 MT/s",0,W*.2);x.restore()});l.position.set(.01,0,.0161);st.add(l);
  st.position.set(-.39,1.85,z);RAM.add(st)}
 /* бейнекарта */
 const GPU=part("gpu","gpu",[1.3,-.35,.25],[.28,.75]);const shroud=SM("#2b3039",{metalness:.6,roughness:.35});
 GPU.add(place(rbox(.58,.12,1.42,shroud,.03),-.17,1.25,-.33));
 GPU.add(place(rbox(.58,.012,1.42,SM("#1c2027",{metalness:.85,roughness:.3}),.004),-.17,1.318,-.33));
 const bpL=labelPlane(.5,.12,(x,W,H)=>{x.fillStyle="#c9a25a";x.font=`800 ${H*.55}px Montserrat`;x.textAlign="center";x.textBaseline="middle";x.fillText("GEFORCE · INF 7",W/2,H/2)});bpL.rotation.set(-Math.PI/2,0,-Math.PI/2);bpL.position.set(-.17,1.3255,-.2);GPU.add(bpL);
 for(let i=0;i<30;i++)GPU.add(place(new THREE.Mesh(new THREE.BoxGeometry(.5,.06,.004),finM),-.17,1.17,-.98+i*.045));
 GPU.add(place(rbox(.012,.022,1.3,rgb(),.004),.125,1.29,-.33));
 const gfans=[];for(const z of[-.8,-.33,.14]){const f=mkPcFan(.42,null);f.rotation.x=Math.PI/2;f.position.set(-.17,1.17,z);GPU.add(f);gfans.push(f)}
 GPU.add(place(rbox(.6,.24,.018,SM("#cfd5de",{metalness:.95,roughness:.25}),.004),-.2,1.27,-1.085));
 GPU.add(place(rbox(.07,.03,.1,SM("#1a1d23"),.006),.0,1.33,.2));
 GPU.add(place(rbox(.02,.03,.38,accent,.004),-.48,1.4,-.62));
 /* NVMe */
 const NV=part("nvme","nvme",[.85,.05,.15],[.3,.7]);const nv=new THREE.Group();nv.add(rbox(.02,.11,.42,SM("#1e7a52"),.004));nv.add(place(rbox(.03,.115,.43,SM("#2c3340",{metalness:.85,roughness:.3}),.008),.02,0,0));
 const nvL=labelPlane(.4,.1,(x,W,H)=>{x.fillStyle="#c9a25a";x.font=`800 ${H*.42}px Montserrat`;x.textAlign="center";x.textBaseline="middle";x.fillText("NVMe M.2 · 1 TB",W/2,H/2)});nvL.position.set(.0355,0,0);nvL.rotation.y=Math.PI/2;nv.add(nvL);nv.position.set(-.465,1.64,-.5);NV.add(nv);
 /* PSU */
 const PSU=part("psu","psu",[1.45,0,-.2],[.3,.75]);const psuM=SM("#1b1e24",{metalness:.4,roughness:.55});
 PSU.add(place(rbox(.75,.43,.8,psuM,.02),-.1,.235,-.68));
 const grill=new THREE.Mesh(new THREE.CircleGeometry(.3,48),meshM(1,1));grill.rotation.x=Math.PI/2;grill.position.set(-.1,.018,-.68);PSU.add(grill);
 const psuL=labelPlane(.6,.3,(x,W,H)=>{x.fillStyle="#f2efe8";x.fillRect(0,0,W,H);x.fillStyle="#15325f";x.font=`800 ${H*.2}px Montserrat`;x.fillText("750W",W*.06,H*.32);x.font=`700 ${H*.1}px Montserrat`;x.fillStyle="#c9a25a";x.fillText("80 PLUS GOLD",W*.06,H*.5);x.fillStyle="#3a4457";x.font=`500 ${H*.07}px 'Noto Sans Mono'`;["AC IN 220-240V ~ 50Hz","+12V 62A  +5V 20A  +3.3V 20A"].forEach((t,i)=>x.fillText(t,W*.06,H*(.68+i*.12)))},{transparent:false});psuL.position.set(.276,.24,-.68);psuL.rotation.y=Math.PI/2;PSU.add(psuL);
 for(let i=0;i<3;i++)PSU.add(place(rbox(.12,.08,.02,SM("#2a2f38"),.006),-.3+i*.16,.25,-.276));
 /* дискілер */
 const HD=part("hdd","hdd",[1.35,0,.55],[.3,.72]);const hdd=new THREE.Group();hdd.add(rbox(.5,.13,.72,SM("#b6bdc8",{metalness:.9,roughness:.32}),.012));
 const hdL=labelPlane(.42,.6,(x,W,H)=>{x.fillStyle="#f4f2ee";x.fillRect(0,0,W,H);x.fillStyle="#15325f";x.font=`800 ${W*.14}px Montserrat`;x.fillText("HDD 2 TB",W*.08,H*.15);x.fillStyle="#3a4457";x.font=`500 ${W*.06}px 'Noto Sans Mono'`;["7200 RPM · SATA 6Gb/s","3.5-inch","+5V 0.6A  +12V 0.5A"].forEach((t,i)=>x.fillText(t,W*.08,H*(.28+i*.08)));x.strokeStyle="#c9a25a";x.lineWidth=6;x.strokeRect(W*.08,H*.6,W*.84,H*.3);x.fillStyle="#c9a25a";x.font=`700 ${W*.07}px Montserrat`;x.fillText("INFORMATIKA 7",W*.14,H*.78)},{transparent:false});hdL.rotation.x=-Math.PI/2;hdL.position.y=.066;hdd.add(hdL);hdd.position.set(-.05,.09,.62);HD.add(hdd);
 const SS=part("ssd","ssd",[1.2,.35,.45],[.3,.72]);const ssd=new THREE.Group();ssd.add(rbox(.36,.035,.5,SM("#20242c",{metalness:.5,roughness:.4}),.01));
 const ssL=labelPlane(.3,.42,(x,W,H)=>{x.fillStyle="#24508f";x.fillRect(0,0,W,H);x.fillStyle="#fff";x.font=`800 ${W*.15}px Montserrat`;x.fillText("SSD",W*.1,H*.3);x.font=`600 ${W*.07}px Montserrat`;x.fillText("SATA · 512 GB",W*.1,H*.45);x.fillStyle="#c9a25a";x.fillRect(W*.1,H*.6,W*.8,6)},{transparent:false});ssL.rotation.x=-Math.PI/2;ssL.position.y=.0185;ssd.add(ssL);ssd.position.set(.15,.597,.75);SS.add(ssd);
 /* желдеткіштер */
 const FF=part("fans","fans",[0,0,1.05],[.1,.4]);const fanObjs=[];for(const y of[.86,1.44,2.02]){const f=mkPcFan(.56,rgb());f.position.set(0,y,1.06);FF.add(f);fanObjs.push(f)}
 const RF=part("fans","fans",[0,0,-.9],[.1,.4]);const rf=mkPcFan(.56,rgb());rf.position.set(0,1.95,-1.07);RF.add(rf);fanObjs.push(rf);
 /* кабельдер */
 const CB=part("cables","cables",[.9,0,0],[.08,.3]);const sleeve=txtTex(64,256,(x,W,H)=>{for(let i=0;i<32;i++){x.fillStyle=i%2?"#1b1f27":"#3a4252";x.fillRect(0,i*8,W,8)}x.globalAlpha=.25;x.fillStyle="#c9a25a";for(let i=0;i<256;i+=16)x.fillRect(0,i,W,2)});sleeve.wrapS=sleeve.wrapT=THREE.RepeatWrapping;sleeve.repeat.set(1,8);
 const cab=(pts,r)=>{const m=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map(p=>new THREE.Vector3(...p))),60,r,14),new THREE.MeshStandardMaterial({map:sleeve,roughness:.7,metalness:.1}));m.castShadow=true;CB.add(m)};
 cab([[-.25,.56,.38],[-.28,1.0,.36],[-.35,1.5,.3],[-.42,1.75,.2]],.04);
 cab([[-.3,.56,-1.0],[-.38,1.2,-1.03],[-.42,2.0,-1.02],[-.43,2.22,-.86]],.022);
 cab([[-.05,.56,.28],[-.02,.95,.3],[0,1.22,.28],[0,1.34,.2]],.03);
 return{root,parts,rgbMats,fans:[cfan,...gfans,...fanObjs]}}

function initPcLab(){
 const host=$("#pclab");if(!host)return;let started=false;
 const io=new IntersectionObserver(es=>{if(es[0].isIntersecting&&!started){started=true;io.disconnect();try{startPcLab(host)}catch(e){console.error(e);host.querySelector(".lab-load").textContent="3D сахна ашылмады. Бетті жаңартып көріңіз."}}},{rootMargin:"300px"});io.observe(host)}
function startPcLab(host){
 const r=new THREE.WebGLRenderer({antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));r.shadowMap.enabled=true;r.shadowMap.type=THREE.PCFSoftShadowMap;r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.05;
 host.prepend(r.domElement);
 const s=new THREE.Scene();const pm=new THREE.PMREMGenerator(r);s.environment=pm.fromScene(new RoomEnvironment(),.04).texture;pm.dispose();
 s.background=gradBg("#ffffff","#e9e6f4");
 s.add(new THREE.HemisphereLight(0xffffff,0x9aa3b8,.5));const d=new THREE.DirectionalLight(0xffffff,2.2);d.position.set(5,8,4);d.castShadow=true;d.shadow.mapSize.set(2048,2048);const sc=d.shadow.camera;sc.left=sc.bottom=-4;sc.right=sc.top=4;d.shadow.bias=-.0004;d.shadow.normalBias=.02;s.add(d);
 const fill=new THREE.DirectionalLight(0xdfe6ff,.8);fill.position.set(-4,3,-3);s.add(fill);
 const inner=new THREE.PointLight(0xbfd6ff,4,3.5);inner.position.set(.2,1.6,.2);s.add(inner);
 const floor=new THREE.Mesh(new THREE.CircleGeometry(9,96),new THREE.MeshStandardMaterial({color:"#ece8f3",roughness:.95,alphaMap:groundAlpha,transparent:true,depthWrite:false}));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;floor.position.y=-.04;s.add(floor);
 const cam=new THREE.PerspectiveCamera(36,1,.05,60);cam.position.set(3.6,2.3,3.1);
 const ctl=new OrbitControls(cam,r.domElement);ctl.target.set(0,1.1,0);ctl.enableDamping=true;ctl.minDistance=1.2;ctl.maxDistance=11;ctl.maxPolarAngle=Math.PI*.52;ctl.enablePan=true;ctl.screenSpacePanning=true;
 const post=makeComposer(r,cam,{radius:.35,k:.9});if(post)post.setScene(s);
 const PC=buildPC();s.add(PC.root);
 /* ауа ағыны */
 const N=260,pos=new Float32Array(N*3),col=new Float32Array(N*3);const seeds=[];for(let i=0;i<N;i++){seeds.push([(Math.random()-.5)*.8,.7+Math.random()*1.55,Math.random()]);}
 const pg=new THREE.BufferGeometry();pg.setAttribute("position",new THREE.BufferAttribute(pos,3));pg.setAttribute("color",new THREE.BufferAttribute(col,3));
 const dot=txtTex(64,64,(x,W,H)=>{const g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,"rgba(255,255,255,1)");g.addColorStop(1,"rgba(255,255,255,0)");x.fillStyle=g;x.fillRect(0,0,64,64)});
 const air=new THREE.Points(pg,new THREE.PointsMaterial({size:.07,map:dot,vertexColors:true,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending}));air.visible=false;s.add(air);
 const cold=new THREE.Color("#4fa3ff"),hot=new THREE.Color("#ff6a4a"),tmp=new THREE.Color();
 /* UI */
 const panel=$("#labPanel"),tip=host.querySelector(".lab-tip"),ld=host.querySelector(".lab-load");ld.remove();
 const info=$("#labInfo"),chips=$("#labParts"),slider=$("#labExplode");
 PC_ORDER.forEach(k=>{if(!PC.parts[k])return;const b=el("button","lab-chip",PC_INFO[k].n.replace(/ \(.*\)/,""));b.dataset.k=k;b.type="button";b.onclick=()=>select(k,true);chips.appendChild(b)});
 const pick=[];PC.root.traverse(o=>{if(o.isMesh||o.isInstancedMesh)pick.push(o)});
 const partOf=o=>{while(o&&!o.userData.part)o=o.parent;return o?o.userData.part:null};
 const box=new THREE.Box3Helper(new THREE.Box3(),0xc9a25a);box.visible=false;s.add(box);
 let sel=null,explode=0,target=0,game=null;
 function hilite(k){box.visible=!!k;if(!k)return;const b=new THREE.Box3();PC.parts[k].forEach(g=>b.expandByObject(g));b.expandByScalar(.02);box.box.copy(b)}
 function select(k,fly){sel=k;hilite(k);chips.querySelectorAll(".lab-chip").forEach(c=>c.classList.toggle("on",c.dataset.k===k));
  if(game){checkGame(k);return}
  const I=PC_INFO[k];info.innerHTML=`<span class="eyebrow">Бөлшек</span><h3>${I.n}</h3><p>${I.d}</p><p class="fact"><b>Білесің бе?</b> ${I.f}</p>`;
  if(fly&&k!=="case"){const b=new THREE.Box3();PC.parts[k].forEach(g=>b.expandByObject(g));const c=b.getCenter(new THREE.Vector3());flyTo(c)}}
 let fly=null;function flyTo(c){const dir=cam.position.clone().sub(ctl.target).normalize();const dist=Math.max(1.8,Math.min(4,cam.position.distanceTo(ctl.target)));fly={t0:ctl.target.clone(),t1:c,p0:cam.position.clone(),p1:c.clone().add(dir.multiplyScalar(dist)),k:0}}
 /* меңзер */
 const ray=new THREE.Raycaster(),mp=new THREE.Vector2();let down=null;
 const groupOf=o=>{while(o&&!o.userData.part)o=o.parent;return o};
 const rayAt=(cx,cy)=>{const rc=r.domElement.getBoundingClientRect();mp.set((cx-rc.left)/rc.width*2-1,-(cy-rc.top)/rc.height*2+1);ray.setFromCamera(mp,cam)};
 const hitAt=(cx,cy)=>{rayAt(cx,cy);const hs=ray.intersectObjects(pick,false).filter(h=>{let o=h.object;while(o){if(!o.visible)return false;o=o.parent}return true});
  for(const h of hs){const g=groupOf(h.object);if(!g)continue;const k=g.userData.part;if(k==="glass"&&glassOn&&explode<.2)continue;if(k==="case"&&hs.length>1)continue;return{g,k,p:h.point}}
  if(hs.length){const g=groupOf(hs[0].object);if(g)return{g,k:g.userData.part,p:hs[0].point}}return null};
 const hit=e=>{const h=hitAt(e.clientX,e.clientY);return h?h.k:null};
 /* бөлшекті сүйреп жылжыту */
 const dplane=new THREE.Plane(),hp=new THREE.Vector3();let drag=null;
 function beginDrag(h){dplane.setFromNormalAndCoplanarPoint(cam.getWorldDirection(new THREE.Vector3()).negate(),h.p);drag={g:h.g,k:h.k,start:h.p.clone(),off0:h.g.userData.off.clone(),moved:false};ctl.enabled=false;resetting=false}
 function moveDrag(cx,cy){rayAt(cx,cy);if(ray.ray.intersectPlane(dplane,hp)){const d=hp.clone().sub(drag.start);if(d.length()>.01)drag.moved=true;drag.g.userData.off.copy(drag.off0).add(d)}}
 function endDrag(){const d=drag;drag=null;ctl.enabled=true;return d}
 r.domElement.addEventListener("pointerdown",e=>{down=[e.clientX,e.clientY];if(e.button!==0||game)return;const h=hitAt(e.clientX,e.clientY);if(h&&h.k!=="case"){beginDrag(h);try{r.domElement.setPointerCapture(e.pointerId)}catch(_){}select(h.k,false)}},{capture:true});
 r.domElement.addEventListener("pointerup",e=>{if(drag){endDrag();down=null;return}if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<6){const k=hit(e);if(k)select(k,false)}down=null});
 r.domElement.addEventListener("pointermove",e=>{if(drag){moveDrag(e.clientX,e.clientY);return}if(e.pointerType!=="mouse")return;const k=hit(e);if(k&&!game){tip.textContent=PC_INFO[k].n+(k!=="case"?" · сүйреп жылжытыңыз":"");tip.style.transform=`translate(${e.offsetX+14}px,${e.offsetY+14}px)`;tip.classList.add("on");r.domElement.style.cursor=k!=="case"?"grab":"pointer"}else{tip.classList.remove("on");r.domElement.style.cursor=""}});
 r.domElement.addEventListener("pointerleave",()=>tip.classList.remove("on"));
 let resetting=false;$("#labPlace").onclick=()=>{resetting=true};
 /* жеке қарау */
 let iso=null;const isoBtn=$("#labIso");
 function setIso(k){iso=k;PC.root.children.forEach(g=>{if(!g.userData.part)return;g.visible=!k||g.userData.part===k||(k==="mb"&&(g.userData.part==="io"||g.userData.part==="cmos"));if(!k&&g.userData.part==="glass")g.visible=glassOn});isoBtn.classList.toggle("on",!!k);isoBtn.textContent=k?"Барлығын көрсету":"Жеке қарау";
  if(k){const b=new THREE.Box3();PC.parts[k].forEach(g=>b.expandByObject(g));const c=b.getCenter(new THREE.Vector3()),sz=b.getSize(new THREE.Vector3()).length();const dir=cam.position.clone().sub(ctl.target).normalize();fly={t0:ctl.target.clone(),t1:c,p0:cam.position.clone(),p1:c.clone().add(dir.multiplyScalar(Math.max(1.3,sz*1.6))),k:0};ctl.minDistance=.4}else ctl.minDistance=1.2}
 isoBtn.onclick=()=>setIso(iso?null:(sel&&sel!=="case"?sel:"mb"));
 /* басқару */
 const sval=$("#labExplodeVal");slider.oninput=()=>{target=explode=+slider.value/100;sval.textContent=slider.value+"%"};
 $("#labOpen").onclick=()=>{target=1;fly={t0:ctl.target.clone(),t1:new THREE.Vector3(.5,1.1,0),p0:cam.position.clone(),p1:new THREE.Vector3(5.6,3.1,4.4).sub(new THREE.Vector3(.5,1.1,0)).multiplyScalar(Math.pow(Math.max(1,1.45/cam.aspect),.75)).add(new THREE.Vector3(.5,1.1,0)),k:0}};$("#labClose").onclick=()=>{target=0;$("#labReset").click()};
 let glassOn=true;$("#labGlass").onclick=e=>{glassOn=!glassOn;if(!iso)PC.parts.glass[0].visible=glassOn;e.currentTarget.classList.toggle("on",!glassOn);e.currentTarget.textContent=glassOn?"Шыны панельді алу":"Шыны панельді қою"};
 let spin=true;$("#labFans").onclick=e=>{spin=!spin;e.currentTarget.classList.toggle("on",!spin);e.currentTarget.textContent=spin?"Желдеткішті тоқтату":"Желдеткішті қосу"};
 $("#labAir").onclick=e=>{air.visible=!air.visible;e.currentTarget.classList.toggle("on",air.visible)};
 const modes=["rainbow","#5aa0ff","#c9a25a","off"];let mode=0;$("#labRgb").onclick=e=>{mode=(mode+1)%modes.length;e.currentTarget.textContent=["RGB: кемпірқосақ","RGB: көк","RGB: алтын","RGB: өшірулі"][mode]};
 $("#labReset").onclick=()=>{fly={t0:ctl.target.clone(),t1:new THREE.Vector3(0,1.1,0),p0:cam.position.clone(),p1:home(),k:0}};
 /* ойын */
 const gbox=$("#labGame");
 $("#labGameBtn").onclick=()=>{const pool=["mb","cpu","cooler","ram","gpu","psu","nvme","ssd","hdd","fans","cables","cmos","io"].sort(()=>Math.random()-.5).slice(0,8);game={pool,i:0,score:0};target=Math.max(target,.55);nextQ()};
 function nextQ(){if(game.i>=game.pool.length){gbox.innerHTML=`<b>Ойын аяқталды!</b> Нәтиже: ${game.score} / ${game.pool.length}. <button class="lab-btn" id="labGameAgain" type="button">Қайта ойнау</button>`;$("#labGameAgain").onclick=()=>$("#labGameBtn").click();game=null;return}
  gbox.innerHTML=`<span class="eyebrow">Сұрақ ${game.i+1} / ${game.pool.length} · Ұпай: ${game.score}</span><div class="q">Сахнадан тап: <b>${PC_INFO[game.pool[game.i]].n}</b></div>`}
 function checkGame(k){const want=game.pool[game.i];const ok=k===want;gbox.insertAdjacentHTML("beforeend",`<div class="${ok?"ok":"bad"}">${ok?"Дұрыс!":"Бұл — "+PC_INFO[k].n+". Дұрыс жауабы көрсетілді."}</div>`);if(ok)game.score++;else hilite(want);game.i++;setTimeout(()=>{if(game)nextQ()},1300)}
 /* цикл */
 const clk=new THREE.Clock();let vis=true;new IntersectionObserver(e=>vis=e[0].isIntersecting).observe(host);
 const home=()=>{const k=Math.pow(Math.max(1,1.45/cam.aspect),.75);return new THREE.Vector3(3.6,2.3,3.1).sub(new THREE.Vector3(0,1.1,0)).multiplyScalar(k).add(new THREE.Vector3(0,1.1,0))};let first=true;
 const rs=()=>{const W=host.clientWidth,H=host.clientHeight;r.setSize(W,H);if(post)post.setSize(W,H);cam.aspect=W/H;cam.updateProjectionMatrix();if(first&&W){first=false;cam.position.copy(home())}};new ResizeObserver(rs).observe(host);rs();
 const ss=(a,b,x)=>{const t=Math.min(1,Math.max(0,(x-a)/(b-a)));return t*t*(3-2*t)};let tt=0;
 const cableParts=PC.parts.cables;
 (function loop(){requestAnimationFrame(loop);const dt=Math.min(clk.getDelta(),.05);if(!vis)return;tt+=dt;
  if(Math.abs(target-explode)>.001){explode+=(target-explode)*Math.min(1,dt*3);slider.value=Math.round(explode*100);sval.textContent=slider.value+"%"}
  for(const k in PC.parts)PC.parts[k].forEach(g=>{const u=g.userData;const f=ss(u.stage[0],u.stage[1],explode);if(resetting)u.off.multiplyScalar(Math.max(0,1-dt*6));g.position.copy(u.base).addScaledVector(u.delta,f).add(u.off)});if(resetting&&!PC.root.children.some(g=>g.userData.off&&g.userData.off.lengthSq()>1e-6))resetting=false;
  cableParts.forEach(g=>{const v=1-ss(.02,.18,explode);g.scale.setScalar(Math.max(.001,v));if(!iso)g.visible=v>.01});
  if(sel)hilite(sel);
  if(spin)PC.fans.forEach((f,i)=>f.userData.rotor.rotation.z-=dt*(i<4?14:18));
  const m=modes[mode];PC.rgbMats.forEach((mat,i)=>{if(m==="off"){mat.emissiveIntensity=0}else{mat.emissiveIntensity=1.3;if(m==="rainbow")mat.emissive.setHSL((tt*.08+i*.09)%1,.9,.5);else mat.emissive.set(m)}});
  if(air.visible){for(let i=0;i<N;i++){const sd=seeds[i];const z=1.05-((sd[2]+tt*.25)%1)*2.15;pos[i*3]=sd[0]+Math.sin(tt*2+i)*.02;pos[i*3+1]=sd[1]+Math.sin(z*3+i)*.03;pos[i*3+2]=z;tmp.copy(cold).lerp(hot,Math.min(1,Math.max(0,(1-z)/1.8)));col.set([tmp.r,tmp.g,tmp.b],i*3)}pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true}
  if(fly){fly.k=Math.min(1,fly.k+dt/.9);const e=fly.k<.5?2*fly.k*fly.k:1-Math.pow(-2*fly.k+2,2)/2;ctl.target.lerpVectors(fly.t0,fly.t1,e);cam.position.lerpVectors(fly.p0,fly.p1,e);if(fly.k>=1)fly=null}
  ctl.update();if(post)post.c.render(dt);else r.render(s,cam)})();
 /* толық экран */
 const wrapEl=$("#labWrap"),fsBtns=[...document.querySelectorAll(".lab-fs")];
 const isFull=()=>document.fullscreenElement===wrapEl||wrapEl.classList.contains("lab-full");
 const fsSync=()=>{const f=isFull();fsBtns.forEach(b=>{b.classList.toggle("on",f);b.setAttribute("aria-label",f?"Толық экраннан шығу":"Толық экран");const t=b.querySelector(".t");if(t)t.textContent=f?"Шығу":"Толық экран"});document.body.classList.toggle("lab-lock",wrapEl.classList.contains("lab-full"))};
 fsBtns.forEach(b=>b.onclick=async()=>{if(isFull()){if(document.fullscreenElement)await document.exitFullscreen().catch(()=>{});wrapEl.classList.remove("lab-full")}else{let ok=false;try{if(wrapEl.requestFullscreen){await wrapEl.requestFullscreen();ok=true}}catch(_){}if(!ok)wrapEl.classList.add("lab-full")}fsSync();setTimeout(rs,60)});
 document.addEventListener("fullscreenchange",()=>{fsSync();setTimeout(rs,60)});
 addEventListener("keydown",e=>{if(e.key==="Escape"&&wrapEl.classList.contains("lab-full")){wrapEl.classList.remove("lab-full");fsSync();setTimeout(rs,60)}});
 /* қолмен басқару: камера + MediaPipe Hands */
 const handBtn=$("#labHand"),hmsg=$("#labHandMsg"),cursorEl=host.querySelector(".lab-cursor"),camBox=host.querySelector(".lab-cam");let hand=null;
 handBtn.onclick=()=>hand?stopHand():startHand();
 function stopHand(){if(!hand)return;hand.stop=true;try{hand.stream.getTracks().forEach(t=>t.stop())}catch(_){}hand=null;camBox.classList.remove("on");cursorEl.classList.remove("on");handBtn.classList.remove("on");handBtn.textContent="Қолмен басқару (камера)";hmsg.textContent="";if(drag)endDrag()}
 async function startHand(){handBtn.disabled=true;hmsg.textContent="Камера қосылуда…";
  try{
   if(!navigator.mediaDevices||!navigator.mediaDevices.getUserMedia)throw new Error("nocam");
   const stream=await navigator.mediaDevices.getUserMedia({video:{width:640,height:480,facingMode:"user"},audio:false});
   const vid=camBox.querySelector("video");vid.srcObject=stream;await vid.play();
   hmsg.textContent="Қол тану моделі жүктелуде…";
   const V="https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
   const vision=await import(V+"/vision_bundle.mjs");
   const files=await vision.FilesetResolver.forVisionTasks(V+"/wasm");
   const lm=await vision.HandLandmarker.createFromOptions(files,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",delegate:"GPU"},runningMode:"VIDEO",numHands:1});
   hand={stream,vid,lm,stop:false,cx:.5,cy:.5,pinch:false,pinchT:0,mode:null,last:null,palmT:0,fistT:0,lastTs:-1};
   camBox.classList.add("on");handBtn.classList.add("on");handBtn.textContent="Қолмен басқаруды өшіру";
   hmsg.innerHTML="Сұқ саусақ — меңзер · <b>шымшу</b> (бас бармақ + сұқ саусақ) — бөлшекті ұстап жылжыту немесе бос жерде көріністі айналдыру · <b>алақанды жаю</b> — бөлшектеу · <b>жұдырық</b> — жинау";
   handLoop();
  }catch(err){console.warn(err);stopHand();const blocked=err&&(err.name==="NotAllowedError"||err.name==="SecurityError"||err.message==="nocam");
   hmsg.textContent=blocked?"Камераға рұқсат берілмеді. Бұл бетте камера жабық болса, сайтты GitHub сілтемесі немесе HTML файл арқылы ашыңыз.":"Қол тану моделі жүктелмеді. Интернетті тексеріп, қайта көріңіз."}
  handBtn.disabled=false}
 const cv2=camBox.querySelector("canvas"),c2=cv2.getContext("2d");
 const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 function handLoop(){if(!hand||hand.stop)return;requestAnimationFrame(handLoop);const H=hand;if(H.vid.readyState<2)return;const ts=performance.now();if(ts<=H.lastTs)return;H.lastTs=ts;
  let res;try{res=H.lm.detectForVideo(H.vid,ts)}catch(_){return}
  c2.clearRect(0,0,cv2.width,cv2.height);
  const L=res.landmarks&&res.landmarks[0];if(!L){cursorEl.classList.remove("on");if(H.pinch){H.pinch=false;finishPinch()}return}
  c2.fillStyle="#c9a25a";L.forEach(p=>{c2.beginPath();c2.arc((1-p.x)*cv2.width,p.y*cv2.height,3,0,7);c2.fill()});
  const size=dist(L[0],L[9])||.1;const pinch=dist(L[4],L[8])/size<(H.pinch?.5:.35);
  const ext=[[8,6],[12,10],[16,14],[20,18]].filter(([t,pp])=>dist(L[t],L[0])>dist(L[pp],L[0])*1.12).length;
  const nx=Math.min(1,Math.max(0,((1-L[8].x)-.18)/.64)),ny=Math.min(1,Math.max(0,(L[8].y-.15)/.6));H.cx+=(nx-H.cx)*.45;H.cy+=(ny-H.cy)*.45;
  const rc=r.domElement.getBoundingClientRect();const px=rc.left+H.cx*rc.width,py=rc.top+H.cy*rc.height;
  cursorEl.classList.add("on");cursorEl.classList.toggle("pinch",pinch);cursorEl.style.transform=`translate(${H.cx*rc.width}px,${H.cy*rc.height}px)`;
  if(pinch&&!H.pinch){H.pinch=true;H.pinchT=ts;const h=hitAt(px,py);if(h&&h.k!=="case"){beginDrag(h);H.mode="drag";select(h.k,false)}else{H.mode="rot";H.last=[H.cx,H.cy];ctl.enabled=false}}
  else if(pinch&&H.pinch){if(H.mode==="drag"&&drag)moveDrag(px,py);else if(H.mode==="rot"){const dx=H.cx-H.last[0],dy=H.cy-H.last[1];H.last=[H.cx,H.cy];const off=cam.position.clone().sub(ctl.target);const sp=new THREE.Spherical().setFromVector3(off);sp.theta-=dx*5;sp.phi=Math.min(ctl.maxPolarAngle,Math.max(.15,sp.phi-dy*4));off.setFromSpherical(sp);cam.position.copy(ctl.target).add(off)}}
  else if(!pinch&&H.pinch){H.pinch=false;finishPinch()}
  else{const h=hitAt(px,py);if(h&&!game){tip.textContent=PC_INFO[h.k].n;tip.style.transform=`translate(${H.cx*rc.width+16}px,${H.cy*rc.height+16}px)`;tip.classList.add("on")}else tip.classList.remove("on")}
  if(!pinch&&ext>=4){H.palmT+=1;if(H.palmT===20&&target<.5){target=1;hmsg.firstChild&&(cursorEl.dataset.g="Бөлшектеу")}}else H.palmT=0;
  if(!pinch&&ext===0){H.fistT+=1;if(H.fistT===20&&target>.5){target=0}}else H.fistT=0;
 }
 function finishPinch(){const H=hand;if(H&&H.mode==="drag"&&drag){endDrag()}else ctl.enabled=true;if(H)H.mode=null}
 select("mb",false);
}
try{initPcLab()}catch(e){console.error(e)}
