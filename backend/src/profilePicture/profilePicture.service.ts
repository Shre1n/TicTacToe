import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { ProfilePicture } from './profilePicture.entity';
import { User } from '../users/users.entity';

@Injectable()
export class ProfilePictureService {
  private readonly profilePictureRepository: Repository<ProfilePicture>;

  constructor(dataSource: DataSource) {
    this.profilePictureRepository = dataSource.getRepository(ProfilePicture);
  }

  /**
   * returns a profilePicture entity with a given id
   * @param id
   */
  async get(id: number) {
    return await this.profilePictureRepository.findOneBy({ id });
  }

  /**
   * saves a new profile picture file inside the db
   * @param profilePicture
   * @param user
   */
  async save(profilePicture: Express.Multer.File, user: User) {
    const newProfilePicture = user.profilePicture
      ? await this.profilePictureRepository.findOneBy({
          id: user.profilePicture.id,
        })
      : new ProfilePicture();
    newProfilePicture.content = profilePicture.buffer;
    await this.profilePictureRepository.save(newProfilePicture);

    return newProfilePicture;
  }
}
