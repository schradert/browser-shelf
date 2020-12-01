export const domainParser: (url: string) => string = 
(url: string) => {
    const regex: RegExp = /([\w-]+)\.(org|com|net)/;
    const match: RegExpMatchArray | null = url.match(regex);
    if (!match) return '';
    return match[1];
};

export const capitalize: (str: string) => string = 
  (str: string) => str.charAt(0).toUpperCase() + str.slice(1);