import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { randomUUID } from 'crypto';

export async function PATCH(req: Request) {
  try {
    const session = await getCachedSession();
    if (!session?.user?.email) return NextResponse.redirect('/auth');

    const { id, contextFields, ...data } = await req.json();

    if (!session?.user?.email || session?.user?.id !== id) return NextResponse.redirect('/auth');

    // @ts-ignore-next-line
    const dbFields = prisma._runtimeDataModel.models.User.fields.map((field: any) => field.name);

    const newData: Record<string, any> = {};

    for (const key of dbFields) {
      newData[key] = data[key] === null ? undefined : data[key];
    }

    if (!!contextFields?.length) {
      newData.contextFields = {
        upsert: contextFields.map((field: any) => {
          delete field.userId;
          const { fieldId, helpText, fieldType, fieldTextValue } = field;
          const contextFieldID = field.id ?? randomUUID();
          return {
            where: { id: contextFieldID },
            create: { ...field },
            update: {
              fieldId,
              helpText,
              fieldType,
              fieldTextValue
            }
          };
        })
      };
    }

    const user = await prisma.user.update({
      where: {
        id
      },
      data: {
        ...newData,
        id
      },
      include: {
        contextFields: true // Include the updated contextFields in the response
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log('[POST] error', error);
    throw error;
  }
}
