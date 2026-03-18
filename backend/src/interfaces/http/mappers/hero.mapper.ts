import { Hero } from "../../../domain/entities/hero";
import { formatDate } from "../../../utils/date-formatter";

export function toHeroResponse(hero: Hero) {
    return {
        ...hero,
        date_of_birth: formatDate(hero.date_of_birth),
        created_at: formatDate(hero.created_at),
        updated_at: formatDate(hero.updated_at),
    };
}