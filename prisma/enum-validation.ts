
  // This file was generated from your schema.prisma file.
  // Any changes made to this file will be overridden by the nex generate command.
  
  import { Colors, Personalities } from '@prisma/client';

  
  /**
   * A function to validate if a string is of type {@link Colors}.
   * @param {string | null | undefined} value The value to test.
   * @returns {boolean} `true` if {@link value} is of type {@link Colors}. Otherwise `false`. 
   */
  export function isColors (value) {
  	if(!value) return false;
  	return Object.values(Colors).includes(value);
  }

  /**
   * A function to validate if a string is of type {@link Personalities}.
   * @param {string | null | undefined} value The value to test.
   * @returns {boolean} `true` if {@link value} is of type {@link Personalities}. Otherwise `false`. 
   */
  export function isPersonalities (value) {
  	if(!value) return false;
  	return Object.values(Personalities).includes(value);
  }
  