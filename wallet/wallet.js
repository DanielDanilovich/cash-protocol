/* CASH Protocol - Wallet UI */
'use strict';

const CashWallet = (() => {
  const CFG = {
    ADDRESS_PREFIX: 'CASH_',
    STORAGE_KEY: 'cash_wallet_v1',
    SESSION_MS: 600000,
  };

  const state = {
    wallet: null,
    pwdHash: '',
    tempPassword: '',
    sessionTimer: null,
  };

  const BIP39_SAMPLE = 'abandon ability able about above absent absorb abstract absurd abuse access accident account accuse achieve acid acoustic acquire across act action actor actress actual adapt add addict address adjust admit adult advance advice aerobic affair afford afraid again age agent agree ahead aim air airport aisle alarm album alcohol alert alien all alley allow almost alone alpha already also alter always amateur amazing among amount amused analyst anchor ancient anger angle angry animal ankle announce annual another answer antenna antique anxiety any apart apology appear apple approve april area arena argue arm armed armor army around arrange arrest arrive arrow art artefact artist artwork ask aspect assault asset assist assume asthma athlete atom attack attend attitude attract auction audit august aunt author auto autumn average avocado avoid awake aware away awesome awful awkward axis baby bachelor bacon badge bag balance balcony ball bamboo banana banner bar barely bargain barrel base basic basket battle beach bean beauty because become beef before begin behave behind believe below belt bench benefit best betray better between beyond bicycle bid bike bind biology bird birth bitter black blade blame blanket blast bleak bless blind blood blossom blouse blue blur blush board boat body boil bomb bone bonus book boost border boring born borrow boss bottom bounce box boy bracket brain brand brass brave bread breeze brick bridge brief bright bring brisk broccoli broken bronze broom brother brown brush bubble bucket budget buffalo build bulb bulk bundle bunker burden burger burst bus business busy butter buyer buzz cabbage cabin cable cactus cage cake call calm camera camp can canal cancel candy cannon canoe canvas canyon capable capital captain car carbon card cargo carpet carry cart case cash casino castle casual cat catalog catch category cattle caught cause caution cave ceiling celery central century cereal certain chain chair chalk champion change chaos chapter charge chase chat cheap check cheese chef cherry chest chicken chief child chimney choice choose chronic chunk churn cigar cinnamon circle citizen city civil claim clap clarify claw clay clean clerk clever click client cliff climb clinic clip clock clog close cloth cloud clown club clump cluster clutch coach coast coconut code coffee coil coin collect color column combo comfort comic common company concert conduct confirm congress connect consider control convince cook cool copper copy coral core corn correct cost cotton couch country couple course cousin cover coyote crack cradle craft cram crane crash crater crawl crazy cream credit creek crew cricket crime crisp critic crop cross crouch crowd crucial cruel crush cry crystal cube culture cup cupboard curious current curtain curve cushion custom cute cycle dad damage damp dance danger daring dash daughter dawn day deal debate debris decade december decide decline decorate decrease deer defense define delay deliver demand demise denial dentist deny depart depend deposit depth deputy derive describe desert design desk despair destroy detail detect develop device devote diagram dial diamond diary dice diesel diet differ digital dignity dilemma dinner dinosaur direct dirt disagree discover disease dish dismiss disorder display distance divert divide divorce dizzy doctor document dog doll dolphin domain donate donkey donor door dose double dove draft dragon drama drastic draw dream dress drift drill drink drip drive drop drum dry duck dumb dune during dust dutch duty dwarf dynamic eager eagle early earn earth easily east easy echo ecology economy edge edit educate effort egg eight either elbow elder electric elegant element elephant elevator elite else embark embody embrace emerge emotion employ empower empty enable enact end endless endorse enemy energy enforce engage engine enhance enjoy enlist ensure enter entire entry envelope episode equal equip era erase erode erosion error erupt escape essay essence estate eternal ethics evidence evil evoke evolve exact example excess exchange excite exclude excuse execute exhaust exhibit exile exist exit exotic expand expect expire explain expose express extend extra eye eyebrow fabric face faculty fade faint faith fall false fame family famous fan fancy fantasy farm fashion fat fatal father fatigue fault favorite feature february federal fee feed feel female fence festival fetch fever few fiber fiction field file film filter final find fine finger finish fire firm first fiscal fish fit fitness fix flag flame flash flat flavor flee flight flip float flock floor flower fluid flush fly foam focus fog foil fold follow food foot force forest forget fork fortune forum forward fossil foster found fox fragile frame frequent fresh friend fringe frog front frost frown frozen fruit fuel fun funny furnace fury future gadget gain galaxy gallery game gap garage garbage garden garlic garment gas gasp gate gather gauge gaze general genius genre gentle genuine gesture ghost giant gift giggle ginger giraffe girl give glad glance glare glass glide glimpse globe gloom glory glove glow glue goat goddess gold good goose gorilla gospel gossip govern gown grab grace grain grant grape grass gravity great green grid grief grit grocery group grow grunt guard guess guide guilt guitar gun gym habit hair half hammer hand happy harbor hard harsh harvest hat have hawk hazard head health heart heavy hedgehog height hello helmet help hen hero hidden high hill hint hip hire history hobby hockey hold hole holiday hollow home honey hood hope horn horror horse hospital host hotel hour hover hub human humble hunt hurry husband hybrid ice icon idea identify idle ignore ill illegal illness image imitate immense immune impact impose improve impulse inch include income increase index indicate indoor industry infant inflict inform inhale inherit initial inject injury inmate inner innocent input inquiry insane insect inside inspire install intact interest into invest invite involve iron island isolate issue item jacket jaguar jar jazz jealous jeans jelly jewel job join joke journey joy judge juice jump jungle junior junk just kangaroo keen keep ketchup key kick kid kidney kind kingdom kiss kit kitchen kite kitten kiwi knee knife knock know lab label labor ladder lady lake lamp language laptop large later latin laugh laundry lava law lawn lawsuit layer lazy leader leaf learn leave lecture left leg legal legend leisure lemon lend length lens leopard lesson letter level liar liberty library license life lift light like limb limit link lion liquid list little live lizard load loan lobster local lock logic lonely long loop lottery loud lounge love loyal lucky luggage lumber lunar lunch luxury lyrics machine mad magic magnet maid mail main major make mammal man manage mandate mango mansion manual maple marble march margin marine market marriage mask mass master match material math matrix matter maximum maze meadow mean measure meat mechanic medal media melody melt member memory mention menu mercy merge merit merry mesh message metal method middle midnight milk million mimic mind mineral minimum minor minute miracle mirror misery miss mistake mix mixed mixture mobile model modify mom moment monitor monkey monster month moon moral more morning mosquito mother motion motor mountain mouse move movie much muffin mule multiply muscle museum mushroom music must mutual myself mystery myth naive name napkin narrow nasty nation nature near neck need negative neglect neither nephew nerve nest net network neutral never news next nice night noble noise nominee noodle normal north nose notable note nothing notice novel now nuclear number nurse nut oak obey object oblige obscure observe obtain obvious occasion offer office offset often oil okay old olive olympic omit once one onion online only open opera opinion oppose option orange orbit orchard order ordinary organ orient original orphan ostrich other outdoor outer output outside oval oven over owner oxygen oyster ozone pact paddle page pair palace palm panda panel panic panther paper parade parent park parrot party pass patch path patient patrol pattern pause pave payment peace peanut pear peasant pelican pen penalty pencil people pepper perfect permit person pet phrase physical piano picnic picture piece pig pigeon pill pilot pink pioneer pipe pistol pitch pizza place planet plastic plate play please pledge pluck plug plunge poem point polar pole police pond pony pool popular portion position possible post potato pottery poverty powder power practice praise predict prefer prepare present pretty prevent price pride primary print priority prison private prize problem process produce profit program project promote proof property prosper protect proud provide public pudding pull pulp pulse pumpkin punch pupil puppy purchase purity purse push put puzzle pyramid quality quantum quarter question quick quit quiz quote rabbit raccoon race rack radar radio rail rain raise rally ramp ranch random range rapid rare rate rather raven raw razor ready real reason rebel rebuild recall receive recipe record recycle reduce reflect reform refuse region regret regular reject relax release relief rely remain remember remind remove render renew rent reopen repair repeat replace report require rescue resemble resist resource response result retire retreat return reunion reveal review reward rhythm rib ribbon rice rich ride ridge rifle right rigid ring riot ripple risk ritual rival river road roast robot robust rocket romance roof rookie room rose rotate rough round route royal rubber rude rug rule run rural sad saddle sadness safe sail saint salt same sample sand satisfy satellite save scale scan scare scatter scene scheme school science scissors scorpion scout scrap screen script scrub sea search season seat second secret section security seed seek segment select sell semester seminar senior sense sentence series service session settle setup seven shadow shaft shallow share shed shell sheriff shield shift shine ship shiver shock shoe shoot shop short shoulder shove shrimp shrug shuffle shy sibling sick side siege sight sign silent silk silly silver similar simple since sing siren sister situate six size skate sketch ski skill skin skirt skull slab slam sleep slender slice slide slight slim slogan slot slow slush small smart smile smoke smooth snack snake snap sniff snow soap soccer social sock soda soft solar soldier solid solution solve someone song soon sorry sort soul sound soup source south space spare spatial spawn speak special speed spell spend sphere spice spider spike spin spirit split spoil sponsor spoon sport spot spray spread spring spy square squeeze squirrel stable stadium staff stage stairs stamp stand start state stay steak steel stem step stereo stick still sting stock stomach stone stool story stove strategy street strike strong struggle student stuff stumble style subject submit subway success such sudden suffer sugar suggest suit summer sun sunny sunset super supply supreme sure surface surge surprise surround survey suspect sustain swallow swamp swap swarm swear sweet swift swim swing switch sword symbol symptom syrup system table tackle tag tail talent talk tank tape target task taste tattoo taxi teach team tell ten tenant tennis tent term test text thank theater them theme then theory there they thing think third this though thought threat three thrive throw thumb thunder ticket tide tiger tilt timber time tiny tip tired tissue title toast tobacco today toddler toe together toilet token tomato tomorrow tone tongue tonight tool tooth top topic toss total touch tough tour tourist toward tower town toy track trade traffic tragic train transfer trap trash travel tray treat tree trend trial tribe trick trigger trim trip trophy trouble truck true truly trumpet trust truth try tube tuition tumble tuna tunnel turkey turn turtle twelve twin twist two type typical ugly umbrella unable unaware uncle uncover under undo unfair unfold unhappy uniform unique unit universe unknown unlock until unusual unveil update upgrade uphold upon upper upset urban urge usage use used useful user usual utility vacuum vague valid valley valuable vanish vapor various vast vault vehicle velvet vendor venture venue verb verify version very vessel veteran viable vibrant vicious victory video view village vintage violate violent virtual virus visit visa visual vital vivid vocal voice void volcano volume vote voyage wage wagon wait walk wall wallet wander want war warm warrior wash waste watch water wave way wealth weapon wear web wedding weird welcome west wet whale what wheat wheel when where whip whisper wide wife wild will win window wine wing wink winner winter wire wisdom wise wish witness wolf woman wonder wood wool word work world worry worth wrap wreck wrestle wrist write wrong yard year yellow you young youth zebra zero zone zoo'.split(' ');

  function newSeed() {
    const indices = crypto.getRandomValues(new Uint32Array(24));
    const words = [];
    for (let i = 0; i < 24; i++) words.push(BIP39_SAMPLE[indices[i] % BIP39_SAMPLE.length]);
    return words.join(' ');
  }

  async function walletFromSeed(seed) {
    const normalized = seed.trim().toLowerCase().replace(/\s+/g, ' ');
    const pk = (await CashCrypto.sha512(normalized)).substring(0, 64);
    const addr = CFG.ADDRESS_PREFIX + (await CashCrypto.sha256(pk));
    return { address: addr, privateKey: pk, seedPhrase: normalized };
  }

  function notify(msg, type) {
    type = type || 'success';
    let n = document.getElementById('cash-notify');
    if (!n) {
      n = document.createElement('div');
      n.id = 'cash-notify';
      n.style.cssText = 'position:fixed;top:20px;right:20px;background:#fff;padding:14px 20px;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.15);border-left:4px solid #16A34A;z-index:9999;font-family:Inter,sans-serif;font-size:13px;font-weight:600;color:#464650;max-width:400px;';
      document.body.appendChild(n);
    }
    const colors = { success: '#16A34A', error: '#DC3545', warning: '#D4CB00' };
    n.style.borderLeftColor = colors[type] || colors.success;
    n.textContent = msg;
    n.style.display = 'block';
    clearTimeout(n._t);
    n._t = setTimeout(() => { n.style.display = 'none'; }, 3500);
  }

  async function createWallet() {
    const pwd = prompt('Enter a strong password (min 12 chars):');
    if (!pwd || pwd.length < 12) { notify('Password too short', 'error'); return; }
    try {
      const seed = newSeed();
      const w = await walletFromSeed(seed);
      const salt = CashCrypto.randomBytes(32);
      const pwdHash = CashCrypto.hex.fromBuf(await CashCrypto.sha256(pwd + CashCrypto.b64.fromBuf(salt)));
      state.wallet = { ...w, balance: 0, transactions: [] };
      state.pwdHash = pwdHash;
      state.tempPassword = pwd;
      const enc = await CashCrypto.encrypt(state.wallet, pwd);
      localStorage.setItem(CFG.STORAGE_KEY, JSON.stringify({ encrypted: enc, pwdHash, version: '1.0.0' }));
      notify('✅ Wallet created!');
      render();
    } catch (e) {
      notify('Error: ' + e.message, 'error');
    }
  }

  async function lock() {
    if (state.sessionTimer) clearTimeout(state.sessionTimer);
    state.wallet = null;
    state.pwdHash = '';
    state.tempPassword = '';
    notify('Wallet locked');
    render();
  }

  function render() {
    const app = document.getElementById('app');
    if (!app) return;
    if (!state.wallet) {
      app.innerHTML = `
        <div style="max-width:480px;margin:80px auto;padding:32px;background:#fff;border-radius:16px;box-shadow:0 8px 32px rgba(70,70,80,.08);font-family:Inter,sans-serif;">
          <h1 style="text-align:center;font-size:26px;font-weight:800;color:#464650;letter-spacing:6px;margin-bottom:6px;">CASH</h1>
          <p style="text-align:center;font-size:10px;color:#7A7A85;letter-spacing:3px;text-transform:uppercase;font-weight:700;margin-bottom:28px;">Sovereign Quantum Wallet</p>
          <button onclick="CashWallet.createWallet()" style="width:100%;padding:16px;background:linear-gradient(135deg,#F6EE25,#D4CB00);color:#464650;border:none;border-radius:100px;font-weight:900;font-size:13px;letter-spacing:1px;text-transform:uppercase;cursor:pointer;">Create New Wallet</button>
          <div style="text-align:center;font-size:10px;color:#7A7A85;margin-top:12px;">AES-256-GCM · PBKDF2-SHA512 2.4M</div>
        </div>`;
      return;
    }
    app.innerHTML = `
      <div style="max-width:640px;margin:40px auto;padding:24px;font-family:Inter,sans-serif;">
        <h1 style="font-size:22px;font-weight:800;color:#464650;margin-bottom:16px;">CASH Wallet</h1>
        <div style="background:#464650;color:#fff;padding:24px;border-radius:16px;margin-bottom:16px;">
          <div style="font-size:10px;text-transform:uppercase;letter-spacing:2px;opacity:.75;font-weight:700;">Total Balance</div>
          <div style="font-size:34px;font-weight:700;font-family:Playfair Display,serif;margin-top:8px;">${state.wallet.balance.toFixed(6)} <span style="font-size:16px;opacity:.7;">CASH</span></div>
        </div>
        <div style="font-family:IBM Plex Mono,monospace;font-size:12px;word-break:break-all;background:#f5f5f5;padding:12px;border-radius:8px;margin-bottom:16px;">${state.wallet.address}</div>
        <button onclick="CashWallet.lock()" style="width:100%;padding:14px;background:#DC3545;color:#fff;border:none;border-radius:100px;font-weight:700;font-size:13px;cursor:pointer;">Lock Wallet</button>
      </div>`;
  }

  async function init() {
    try {
      const raw = localStorage.getItem(CFG.STORAGE_KEY);
      if (raw) {
        const wrapper = JSON.parse(raw);
        if (wrapper.encrypted) notify('Existing wallet — enter password to unlock', 'warning');
      }
    } catch (e) {}
    render();
  }

  return { init, createWallet, lock, render };
})();

document.addEventListener('DOMContentLoaded', () => CashWallet.init());
window.CashWallet = CashWallet;
