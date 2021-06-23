import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return await this.repository
      .createQueryBuilder("games")
      .where("UPPER(games.title) like :param", {
        param: `%${param.toUpperCase()}%`,
      })
      .getMany();
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return await this.repository.query(`select count(id) from games; `); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return await this.repository
      .createQueryBuilder("games")
      .select(
        "users.first_name as first_name,users.last_name as last_name, users.email as email"
      )
      .leftJoinAndSelect("games.users", "users")
      .where("games.id =:id", { id })
      //.getSql()
      .getRawMany();
    // Complete usando query builder
  }
}
