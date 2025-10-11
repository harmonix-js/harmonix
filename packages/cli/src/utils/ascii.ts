export const themeColor = '\u001B[38;2;75;67;238m'
export const bgThemeColor = '\u001B[48;2;75;67;238m'
const icon = [
  `         ,x,`,
  `       .$$$$$.`,
  `     a$$$'^'$$$e`,
  `   ,$$p'     'q$$,`,
  `   *$$b,     ,d$$*`,
  `     "@$$,v,$$@"`,
  `       >$$$$$<`,
  `     ,d$$$^$$$b,`,
  `    <x$@/   \\@$x>`
]

export const harmonixIcon = icon
  .map((line) => [...line].join(themeColor))
  .join('\n')
