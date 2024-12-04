/**
 * Make same property optional on type
 *
 * @example
 * ```typescript
 * type: Past {
 *  id: string;
 *  name: string;
 *  email: string;
 * }
 *
 * Optinal<Post, 'id' | 'email'>
 *
 */
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
