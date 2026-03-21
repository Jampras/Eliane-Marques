import 'server-only';
import { getPublicSiteUrl } from '@/lib/env/server';
import { isSameOriginRequest as isSameOriginRequestWithConfiguredOrigin } from './request-security-helpers';

export function isSameOriginRequest(requestHeaders: Headers) {
  return isSameOriginRequestWithConfiguredOrigin(requestHeaders, getPublicSiteUrl());
}
