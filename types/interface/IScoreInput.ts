export interface IScoreInput {
  custom_id: string;
  name: string;
  description?: string;
  author: string;
  /**
   * Note:
   * This is a Foreign Key to `group.id`.<fk table='group' column='id'/>
   */
  checked_to?: string;
  level: string;
}
