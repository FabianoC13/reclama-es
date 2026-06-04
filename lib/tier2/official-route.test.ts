import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '@/lib/db';
import { findBestRouteForCase } from '@/lib/tier2/official-route';

describe('findBestRouteForCase', () => {
  beforeAll(async () => {
    await prisma.officialAuthority.upsert({
      where: { id: 'test-madrid-auth' },
      update: {},
      create: {
        id: 'test-madrid-auth',
        name: 'Test Madrid OMIC',
        shortName: 'OMIC Madrid',
        authorityType: 'municipal_omic',
        municipality: 'Madrid',
        postalCodePrefixes: '28',
        verificationStatus: 'verified',
      },
    });
    await prisma.officialSubmissionRoute.upsert({
      where: { routeSlug: 'madrid-omic-reclamaciones-consumo' },
      update: {},
      create: {
        authorityId: 'test-madrid-auth',
        routeName: 'Test Madrid Route',
        routeSlug: 'madrid-omic-reclamaciones-consumo',
        routeType: 'sede_specific_form',
        procedureName: 'Test',
        supportedAuthMethods: '[]',
        verificationStatus: 'verified',
      },
    });
  });

  it('returns Madrid route for Madrid postal code', async () => {
    const c = await prisma.case.create({
      data: {
        sessionId: 'test-session',
        wizardDataJson: '{}',
        ciudad: 'Madrid',
        codigoPostal: '28001',
      },
    });
    const result = await findBestRouteForCase(c.id);
    expect(result.bestRoute?.routeSlug).toBe('madrid-omic-reclamaciones-consumo');
    expect(result.confidence).toBe('high');
    await prisma.case.delete({ where: { id: c.id } });
  });

  it('returns no route for unknown city', async () => {
    const c = await prisma.case.create({
      data: {
        sessionId: 'test-session-2',
        wizardDataJson: '{}',
        ciudad: 'Lugo',
        codigoPostal: '27001',
      },
    });
    const result = await findBestRouteForCase(c.id);
    expect(result.bestRoute).toBeNull();
    expect(result.confidence).toBe('none');
    await prisma.case.delete({ where: { id: c.id } });
  });
});
