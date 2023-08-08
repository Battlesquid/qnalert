export const groupby = <T extends object>(items: T[], prop: keyof T): Record<string, T[]> => {
    const grouped: Record<string, T[]> = {};
    items.forEach(el => Array.isArray(grouped[el[prop]])
        ? grouped[el[prop]].push(el)
        : grouped[el[prop]] = [el]
    );
    return grouped;
};
