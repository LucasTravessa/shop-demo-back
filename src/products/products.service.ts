import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Product } from '@prisma/client';
import { ICreateOrUpdateProductBody } from '@/_validators/products/products.model';
import { FindAllProductsDto } from '@/_validators/products/products_findAll';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: ICreateOrUpdateProductBody): Promise<Product> {
    return this.prisma.product.create({ data: createProductDto });
  }

  async findAll(findAllProductsDto: FindAllProductsDto): Promise<Product[]> {
    const { sortBy, order, searchBy, search } = findAllProductsDto;

    const query: Prisma.ProductFindManyArgs = {};

    if (searchBy && search) {
      query['where'] = {
        AND: [
          {
            isDeleted: {
              equals: false,
            },
          },
          {
            [searchBy]: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      };
    } else if (search) {
      query['where'] = {
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
        AND: {
          isDeleted: {
            equals: false,
          },
        },
      };
    }

    if (sortBy && order) {
      query['orderBy'] = {
        [sortBy]: order,
      };
    } else if (order) {
      query['orderBy'] = {
        price: order as 'asc' | 'desc',
      };
    }

    if (!Object.keys(query).length) {
      query['where'] = {
        isDeleted: false,
      };
      query['orderBy'] = { price: 'asc' };
    }

    return this.prisma.product.findMany(query);
  }

  async findOne(productId: number): Promise<Product | null> {
    return this.prisma.product.findFirst({
      where: {
        AND: [
          {
            id: {
              equals: productId,
            },
          },
          {
            isDeleted: {
              equals: false,
            },
          },
        ],
      },
    });
  }

  async update(
    productId: number,
    updateProductDto: ICreateOrUpdateProductBody,
  ): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: updateProductDto,
    });
  }

  async remove(productId: number): Promise<Product> {
    return this.prisma.product.update({
      where: {
        id: productId,
      },
      data: {
        isDeleted: true,
      },
    });
  }

  /** ***************************************************************
   ************          Db > API transforms          ************
   **************************************************************** */

  getProductFromDb(product: Product): Product {
    return product;
  }
}
