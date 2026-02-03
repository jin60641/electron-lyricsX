import { LyricRequest } from '../types';

export const makeKeyword = (data: Partial<LyricRequest>) => (data.artist && data.name ? `${data.artist} - ${data.name}` : (data.artist || data.name));
