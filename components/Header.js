import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const logoSvgMarkup = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1263 1246" role="img" aria-labelledby="title desc" style="display:block;width:100%;height:100%">
  <title id="title">Nova Escola Politécnica do Huambo logo</title>
  <desc id="desc">Editable vector recreation of the supplied emblem, with CSS variables for theme colors and optional animation classes.</desc>
  <style>
    .logo-blue { fill: var(--logo-blue); }
    .logo-red { fill: var(--logo-red); }
    .logo-yellow { fill: var(--logo-yellow); }
    .logo-black { fill: var(--logo-black); }
    .logo { opacity: var(--logo-opacity); }
  </style>
  <g class="logo" shape-rendering="geometricPrecision">
    <g class="logo-blue" fill-rule="evenodd" clip-rule="evenodd">
      <path d="M 575.0 410.0 L 675.0 411.0 L 671.0 381.0 L 581.0 380.0 Z "/>
      <path d="M 811.0 338.0 L 790.0 350.0 L 775.0 369.0 L 766.0 377.0 L 756.0 381.0 L 728.0 381.0 L 734.0 411.0 L 760.0 411.0 L 773.0 408.0 L 789.0 399.0 L 812.0 372.0 L 821.0 367.0 L 834.0 364.0 L 855.0 365.0 L 883.0 371.0 L 917.0 375.0 L 949.0 383.0 L 961.0 389.0 L 974.0 403.0 L 979.0 420.0 L 982.0 477.0 L 983.0 585.0 L 987.0 604.0 L 993.0 612.0 L 1006.0 618.0 L 1036.0 615.0 L 1076.0 615.0 L 1088.0 619.0 L 1094.0 626.0 L 1097.0 645.0 L 1099.0 701.0 L 1104.0 717.0 L 1121.0 740.0 L 1121.0 764.0 L 1119.0 773.0 L 1112.0 786.0 L 1106.0 792.0 L 1099.0 795.0 L 1025.0 795.0 L 1007.0 800.0 L 996.0 807.0 L 982.0 824.0 L 976.0 841.0 L 975.0 894.0 L 977.0 938.0 L 981.0 953.0 L 987.0 965.0 L 1038.0 1046.0 L 1097.0 1127.0 L 1101.0 1135.0 L 1102.0 1143.0 L 1100.0 1147.0 L 1093.0 1152.0 L 1070.0 1157.0 L 1043.0 1159.0 L 951.0 1158.0 L 919.0 1155.0 L 841.0 1134.0 L 789.0 1127.0 L 611.0 1110.0 L 474.0 1100.0 L 454.0 1100.0 L 450.0 1130.0 L 600.0 1140.0 L 791.0 1158.0 L 834.0 1164.0 L 898.0 1182.0 L 937.0 1188.0 L 1040.0 1190.0 L 1078.0 1187.0 L 1098.0 1183.0 L 1120.0 1172.0 L 1130.0 1160.0 L 1134.0 1147.0 L 1133.0 1130.0 L 1129.0 1119.0 L 1046.0 1002.0 L 1010.0 941.0 L 1007.0 899.0 L 1007.0 848.0 L 1012.0 836.0 L 1027.0 826.0 L 1096.0 827.0 L 1114.0 823.0 L 1128.0 815.0 L 1144.0 796.0 L 1153.0 771.0 L 1154.0 739.0 L 1148.0 722.0 L 1135.0 707.0 L 1131.0 698.0 L 1129.0 639.0 L 1125.0 617.0 L 1120.0 607.0 L 1111.0 597.0 L 1093.0 587.0 L 1074.0 584.0 L 1017.0 585.0 L 1014.0 460.0 L 1010.0 411.0 L 1001.0 386.0 L 985.0 368.0 L 969.0 358.0 L 953.0 352.0 L 904.0 342.0 L 850.0 334.0 L 828.0 334.0 Z "/>
      <path d="M 313.0 239.0 L 268.0 239.0 L 210.0 247.0 L 199.0 252.0 L 190.0 260.0 L 183.0 279.0 L 184.0 303.0 L 194.0 336.0 L 254.0 474.0 L 274.0 525.0 L 299.0 598.0 L 312.0 629.0 L 314.0 654.0 L 307.0 673.0 L 261.0 730.0 L 246.0 757.0 L 228.0 812.0 L 204.0 907.0 L 184.0 971.0 L 170.0 1001.0 L 130.0 1060.0 L 118.0 1090.0 L 116.0 1112.0 L 118.0 1122.0 L 125.0 1135.0 L 140.0 1148.0 L 164.0 1156.0 L 184.0 1158.0 L 249.0 1156.0 L 342.0 1138.0 L 350.0 1135.0 L 355.0 1104.0 L 281.0 1120.0 L 230.0 1127.0 L 171.0 1126.0 L 154.0 1120.0 L 148.0 1112.0 L 148.0 1100.0 L 155.0 1080.0 L 198.0 1015.0 L 213.0 983.0 L 237.0 906.0 L 264.0 801.0 L 276.0 767.0 L 292.0 741.0 L 334.0 689.0 L 341.0 675.0 L 345.0 659.0 L 345.0 634.0 L 340.0 614.0 L 282.0 459.0 L 222.0 321.0 L 215.0 297.0 L 215.0 282.0 L 218.0 278.0 L 224.0 276.0 L 274.0 270.0 L 305.0 269.0 L 320.0 272.0 L 331.0 277.0 L 356.0 294.0 L 371.0 300.0 L 393.0 304.0 L 430.0 306.0 L 449.0 311.0 L 455.0 315.0 L 464.0 326.0 L 475.0 356.0 L 488.0 377.0 L 499.0 388.0 L 511.0 396.0 L 521.0 399.0 L 528.0 375.0 L 528.0 370.0 L 521.0 366.0 L 506.0 348.0 L 490.0 308.0 L 482.0 297.0 L 472.0 289.0 L 459.0 282.0 L 442.0 277.0 L 381.0 271.0 L 371.0 267.0 L 336.0 245.0 Z "/>
      <path d="M 279.0 35.0 L 270.0 35.0 L 262.0 39.0 L 157.0 129.0 L 153.0 137.0 L 153.0 145.0 L 156.0 152.0 L 207.0 227.0 L 218.0 235.0 L 225.0 236.0 L 234.0 234.0 L 294.0 200.0 L 299.0 193.0 L 300.0 184.0 L 288.0 164.0 L 348.0 116.0 L 354.0 107.0 L 354.0 97.0 L 347.0 87.0 L 303.0 51.0 Z M 274.0 69.0 L 303.0 91.0 L 315.0 103.0 L 255.0 151.0 L 251.0 159.0 L 251.0 167.0 L 261.0 183.0 L 228.0 203.0 L 187.0 143.0 Z "/>
    </g>
    <g class="logo-yellow" fill-rule="evenodd" clip-rule="evenodd">
      <path d="M 647.0 747.0 L 616.0 770.0 L 592.0 793.0 L 572.0 816.0 L 540.0 862.0 L 511.0 917.0 L 524.0 931.0 L 542.0 944.0 L 558.0 953.0 L 584.0 963.0 L 610.0 968.0 L 641.0 968.0 L 673.0 961.0 L 698.0 950.0 L 715.0 939.0 L 733.0 924.0 L 752.0 903.0 L 743.0 877.0 L 727.0 845.0 L 706.0 811.0 L 673.0 770.0 Z "/>
      <path d="M 586.0 729.0 L 492.0 740.0 L 457.0 815.0 L 459.0 832.0 L 466.0 852.0 L 514.0 793.0 L 547.0 760.0 Z "/>
      <path d="M 685.0 721.0 L 707.0 737.0 L 735.0 763.0 L 758.0 789.0 L 787.0 828.0 L 790.0 806.0 L 747.0 716.0 Z "/>
      <path d="M 725.0 669.0 L 722.0 662.0 L 711.0 653.0 L 674.0 633.0 L 646.0 626.0 L 614.0 625.0 L 578.0 633.0 L 554.0 644.0 L 535.0 656.0 L 523.0 667.0 L 511.0 695.0 L 607.0 682.0 L 714.0 672.0 Z "/>
    </g>
    <g class="logo-red" fill-rule="evenodd" clip-rule="evenodd">
      <path d="M 492.0 739.0 L 408.0 751.0 L 323.0 902.0 L 219.0 1076.0 L 221.0 1080.0 L 318.0 1080.0 L 323.0 1076.0 L 396.0 938.0 L 456.0 818.0 Z "/>
      <path d="M 749.0 715.0 L 748.0 718.0 L 791.0 809.0 L 934.0 1090.0 L 938.0 1092.0 L 1039.0 1092.0 L 1041.0 1089.0 L 908.0 867.0 L 820.0 713.0 Z "/>
      <path d="M 642.0 17.0 L 625.0 16.0 L 611.0 22.0 L 600.0 37.0 L 598.0 57.0 L 561.0 58.0 L 552.0 68.0 L 552.0 101.0 L 554.0 105.0 L 562.0 111.0 L 592.0 111.0 L 594.0 116.0 L 564.0 241.0 L 530.0 366.0 L 529.0 376.0 L 491.0 507.0 L 488.0 512.0 L 480.0 516.0 L 470.0 526.0 L 462.0 544.0 L 460.0 560.0 L 465.0 586.0 L 468.0 591.0 L 485.0 606.0 L 460.0 649.0 L 429.0 709.0 L 511.0 696.0 L 510.0 694.0 L 550.0 609.0 L 695.0 599.0 L 726.0 670.0 L 794.0 664.0 L 757.0 595.0 L 780.0 587.0 L 788.0 577.0 L 790.0 569.0 L 790.0 534.0 L 788.0 527.0 L 780.0 517.0 L 772.0 512.0 L 758.0 509.0 L 756.0 506.0 L 728.0 392.0 L 726.0 376.0 L 668.0 113.0 L 669.0 111.0 L 701.0 111.0 L 708.0 105.0 L 710.0 101.0 L 710.0 67.0 L 705.0 60.0 L 697.0 57.0 L 665.0 57.0 L 661.0 33.0 L 654.0 24.0 Z M 504.0 560.0 L 505.0 552.0 L 510.0 547.0 L 518.0 544.0 L 747.0 544.0 L 753.0 546.0 L 752.0 557.0 L 516.0 570.0 L 510.0 568.0 Z M 630.0 144.0 L 671.0 377.0 L 669.0 380.0 L 671.0 380.0 L 673.0 384.0 L 692.0 507.0 L 553.0 508.0 L 553.0 500.0 L 573.0 412.0 L 584.0 411.0 L 575.0 411.0 L 574.0 404.0 L 581.0 379.0 Z "/>
    </g>
    <g class="logo-black" fill-rule="evenodd" clip-rule="evenodd">
      <path d="M 894.0 659.0 L 889.0 655.0 L 877.0 655.0 L 799.0 663.0 L 787.0 666.0 L 601.0 684.0 L 479.0 701.0 L 398.0 715.0 L 374.0 721.0 L 359.0 747.0 L 359.0 752.0 L 364.0 757.0 L 497.0 737.0 L 576.0 728.0 L 587.0 729.0 L 543.0 765.0 L 509.0 800.0 L 466.0 854.0 L 439.0 897.0 L 405.0 963.0 L 375.0 1036.0 L 356.0 1102.0 L 347.0 1151.0 L 348.0 1155.0 L 353.0 1158.0 L 443.0 1158.0 L 447.0 1156.0 L 449.0 1137.0 L 452.0 1131.0 L 449.0 1130.0 L 452.0 1105.0 L 466.0 1040.0 L 487.0 973.0 L 510.0 916.0 L 538.0 863.0 L 569.0 818.0 L 610.0 774.0 L 646.0 746.0 L 661.0 757.0 L 679.0 775.0 L 716.0 824.0 L 746.0 881.0 L 768.0 944.0 L 777.0 945.0 L 834.0 926.0 L 837.0 922.0 L 836.0 915.0 L 789.0 832.0 L 741.0 771.0 L 717.0 747.0 L 684.0 721.0 L 687.0 719.0 L 790.0 712.0 L 895.0 711.0 L 899.0 705.0 Z "/>
    </g>
  </g>
</svg>`

export default function Header() {
  const [open, setOpen] = useState(false)
  const [theme, setTheme] = useState('light')
  const logoRef = useRef(null)

  useEffect(() => {
    if (!logoRef.current) return

    const svg = logoRef.current.querySelector('svg')
    const bluePaths = Array.from(logoRef.current.querySelectorAll('.logo-blue path'))
    if (!svg || !bluePaths.length) return

    const outlineStroke = theme === 'dark' ? '#ffffff' : '#0b2cff'

    gsap.set(svg, { opacity: 1, scale: 1, transformOrigin: 'center center' })

    gsap.set(bluePaths, {
      fill: 'transparent',
      stroke: outlineStroke,
      strokeWidth: 5,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeDasharray: (index, target) => target.getTotalLength(),
      strokeDashoffset: (index, target) => target.getTotalLength(),
      opacity: 1,
    })

    gsap.to(bluePaths, {
      strokeDashoffset: 0,
      duration: 2.6,
      ease: 'none',
      stagger: 0.04,
      repeat: -1,
      repeatDelay: 0.5,
      onRepeat: () => {
        gsap.set(bluePaths, {
          strokeDashoffset: (index, target) => target.getTotalLength(),
        })
      },
    })
  }, [theme])

  const logoVars = theme === 'dark'
    ? { '--logo-blue': '#ffffff', '--logo-red': '#ffffff', '--logo-yellow': '#ffffff', '--logo-black': '#ffffff', '--logo-opacity': '1' }
    : { '--logo-blue': '#003fd1', '--logo-red': '#e8010c', '--logo-yellow': '#ffcf00', '--logo-black': '#060606', '--logo-opacity': '1' }

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
      document.documentElement.classList.toggle('dark', stored === 'dark')
    } else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }, [])

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    try { localStorage.setItem('theme', next) } catch (e) {}
    document.documentElement.classList.toggle('dark', next === 'dark')
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl transition-colors duration-200 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-6 py-3 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex items-center gap-3">
          <a href="/" className="flex items-center gap-3">
            <div
              ref={logoRef}
              className="h-10 w-10 shrink-0 md:h-11 md:w-11"
              dangerouslySetInnerHTML={{ __html: logoSvgMarkup }}
              style={logoVars}
            />
            <span className="leading-tight text-slate-900 dark:text-white">
              <span className="block text-base font-black uppercase tracking-[0.16em] text-[#08263a] dark:text-white">
                Nova Escola
              </span>
              <span className="mt-1 block bg-gradient-to-r from-[#b98b2d] via-[#d4a94f] to-[#08263a] bg-clip-text text-xs font-semibold uppercase tracking-[0.3em] text-transparent dark:from-[#f2d79d] dark:via-[#c49b40] dark:to-[#ffffff]">
                Politécnica do Huambo
              </span>
            </span>
          </a>
        </div>

        <nav aria-label="Main Navigation" className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex dark:text-slate-200">
          <a href="/sobre" className="transition hover:text-[#b98b2d]">Sobre</a>
          <a href="/ceph" className="transition hover:text-[#b98b2d]">ceph</a>
          <a href="/impph" className="transition hover:text-[#b98b2d]">impph</a>
          <a href="/contactos" className="transition hover:text-[#b98b2d]">contactos</a>
          <a href="/curriculo" className="transition hover:text-[#b98b2d]">currículo</a>
          <a href="/portais" className="transition hover:text-[#b98b2d]">portais</a>
          <div className="ml-2 flex items-center gap-3">
            <a href="/secretaria" className="rounded-full bg-[#08263a] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#0d3550]">Secretaria</a>
            <button onClick={toggleTheme} aria-label="Alternar tema" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {theme === 'dark' ? (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.02 0l.707-.707M6.343 6.343l-.707-.707"/></svg>
              ) : (
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"/></svg>
              )}
            </button>
          </div>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
          <button onClick={toggleTheme} aria-label="Alternar tema" className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-200">
            {theme === 'dark' ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8-9h1M3 12H2m15.364-6.364l.707.707M6.343 17.657l-.707.707m12.02 0l.707-.707M6.343 6.343l-.707-.707"/></svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 118.646 3.646 7 7 0 0020.354 15.354z"/></svg>
            )}
          </button>
          <a href="/secretaria" className="rounded-full bg-[#08263a] px-3 py-2 text-sm font-semibold text-white">Secretaria</a>
        </div>
      </div>

      <div className={`md:hidden ${open ? 'block' : 'hidden'}`} role="navigation" aria-label="Mobile Navigation">
        <div className="mx-auto max-w-6xl px-6 pb-4 lg:px-8">
          <div className="rounded-[1.25rem] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
            <a onClick={() => setOpen(false)} href="/sobre" className="block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">Sobre</a>
            <a onClick={() => setOpen(false)} href="/ceph" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">ceph</a>
            <a onClick={() => setOpen(false)} href="/impph" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">impph</a>
            <a onClick={() => setOpen(false)} href="/contactos" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">contactos</a>
            <a onClick={() => setOpen(false)} href="/curriculo" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">currículo</a>
            <a onClick={() => setOpen(false)} href="/portais" className="mt-1 block px-2 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700">portais</a>
          </div>
        </div>
      </div>
    </header>
  )
}
