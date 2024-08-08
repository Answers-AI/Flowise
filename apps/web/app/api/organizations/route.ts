import { NextResponse } from 'next/server';
import getCachedSession from '@ui/getCachedSession';
import { prisma } from '@db/client';
import { randomUUID } from 'crypto';

export async function PATCH(req: Request) {
  try {
    const session = await getCachedSession();
    if (!session?.user?.email) return NextResponse.redirect('/auth');

    const { id, contextFields, ...data } = await req.json();

    if (!session?.user?.email || session?.user?.organizationId !== id)
      return NextResponse.redirect('/auth');

    // Pulls all of the columns for the Organization model so they
    // can be set to undefined, which will keep them from being updated
    // @ts-ignore-next-line
    const dbFields = prisma._runtimeDataModel.models.Organization.fields.map(
      (field: any) => field.name
    );

    const newData: Record<string, any> = {};

    for (const key of dbFields) {
      newData[key] = data[key] === null ? undefined : data[key];
    }

    if (!!contextFields?.length) {
      newData.contextFields = {
        upsert: contextFields.map((field: any) => {
          delete field.organizationId;
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

    const organization = await prisma.organization.update({
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

    return NextResponse.json(organization);
  } catch (error) {
    console.log('[POST] error', error);
    throw error;
  }
}
