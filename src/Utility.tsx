export const shortenAddy = (addy: string) => {
    const first = addy.slice(0, 7);
    let lastFive = addy.slice(-5);
    return `${first}...${lastFive}`;
}