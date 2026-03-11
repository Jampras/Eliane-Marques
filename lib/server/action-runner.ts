import { revalidatePath, revalidateTag } from 'next/cache';
import { logServerError, mapServerErrorToMessage } from './errors';

export type ActionResponse = { success: boolean; error?: string };

interface RunAdminMutationOptions {
  context: string;
  pathsToRevalidate?: string[];
  tagsToRevalidate?: string[];
  mutation: () => Promise<{
    pathsToRevalidate?: string[];
    tagsToRevalidate?: string[];
  } | void>;
}

export async function runAdminMutation({
  context,
  mutation,
  pathsToRevalidate = [],
  tagsToRevalidate = [],
}: RunAdminMutationOptions): Promise<ActionResponse> {
  try {
    const mutationResult = await mutation();
    const allPathsToRevalidate = [
      ...pathsToRevalidate,
      ...(mutationResult?.pathsToRevalidate ?? []),
    ];
    const allTagsToRevalidate = [
      ...tagsToRevalidate,
      ...(mutationResult?.tagsToRevalidate ?? []),
    ];

    for (const path of new Set(allPathsToRevalidate)) {
      revalidatePath(path);
    }

    for (const tag of new Set(allTagsToRevalidate)) {
      revalidateTag(tag, 'max');
    }

    return { success: true };
  } catch (error) {
    logServerError(context, error);
    return { success: false, error: mapServerErrorToMessage(error) };
  }
}
