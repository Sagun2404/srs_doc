import { SRSSection } from '../types';
import srsData from './srs-data.json';

// Type for the JSON structure
interface SRSJsonData {
    use_cases?: any[];
    functional_requirements?: any[];
    data_requirements?: any[];
    external_interface_requirements?: any[];
    domain_specific_specifications?: any[];
    nfr_performance_scalability?: any[];
    nfr_security_compliance?: any[];
    nfr_reliability_availability?: any[];
    nfr_usability?: any[];
    nfr_maintainability?: any[];
    nfr_portability?: any[];
    nfr_compatibility?: any[];
    design_constraints?: any[];
    regulatory_constraints?: any[];
    operational_requirements?: any[];
    assumptions?: any[];
    external_dependencies?: any[];
    acceptance_criteria?: any[];
    technical_risks?: any[];
    prerequisites?: any[];
    rbac_matrix?: any[];
    traceability_map?: any[];
    data_privacy_inventory?: any[];
    system_scope?: string;
    system_context_diagram?: string;
    glossary?: string[];
    version_info?: string;
    change_log?: any[];
}

/**
 * Converts the raw SRS JSON data into the hierarchical SRSSection format
 * expected by the webapp
 */
export function convertSRSDataToSections(): SRSSection[] {
    const data = srsData as SRSJsonData;
    const sections: SRSSection[] = [];

    // 1. System Overview
    sections.push({
        id: 'system-overview',
        title: '1. System Overview',
        level: 1,
        content: data.system_scope || 'NFT Marketplace System',
        children: [
            {
                id: 'scope',
                title: '1.1 Scope',
                level: 2,
                content: data.system_scope || ''
            },
            {
                id: 'context',
                title: '1.2 System Context',
                level: 2,
                content: data.system_context_diagram || ''
            },
            {
                id: 'glossary',
                title: '1.3 Glossary',
                level: 2,
                content: data.glossary?.join('\n') || ''
            },
            {
                id: 'version',
                title: '1.4 Version',
                level: 2,
                content: data.version_info || ''
            }
        ]
    });

    // 2. Use Cases
    if (data.use_cases) {
        const useCaseChildren = data.use_cases.map((uc) => ({
            id: uc.id.replace(':', '').toLowerCase(),
            title: `${uc.id} ${uc.title}`,
            level: 2,
            content: `Actor: ${uc.actor}\nPrecondition: ${uc.precondition}\n\nMain Flow:\n${uc.main_flow?.join('\n')}\n\nPostcondition: ${uc.postcondition}`
        }));

        sections.push({
            id: 'use-cases',
            title: '2. Use Cases',
            level: 1,
            content: 'User scenarios and interactions',
            children: useCaseChildren
        });
    }

    // 3. Functional Requirements
    if (data.functional_requirements) {
        const frChildren = data.functional_requirements.map((fr) => ({
            id: fr.id.replace(':', '').toLowerCase(),
            title: fr.id,
            level: 2,
            content: fr.text
        }));

        sections.push({
            id: 'functional-requirements',
            title: '3. Functional Requirements',
            level: 1,
            content: 'Core system capabilities',
            children: frChildren
        });
    }

    // 4. Non-Functional Requirements
    const nfrChildren: SRSSection[] = [];

    if (data.nfr_performance_scalability) {
        nfrChildren.push({
            id: 'nfr-performance',
            title: '4.1 Performance & Scalability',
            level: 2,
            content: data.nfr_performance_scalability
                .map((n) => `${n.id}: ${n.text}`)
                .join('\n\n')
        });
    }

    if (data.nfr_security_compliance) {
        nfrChildren.push({
            id: 'nfr-security',
            title: '4.2 Security & Compliance',
            level: 2,
            content: data.nfr_security_compliance
                .map((n) => `${n.id}: ${n.text}`)
                .join('\n\n')
        });
    }

    if (data.nfr_reliability_availability) {
        nfrChildren.push({
            id: 'nfr-reliability',
            title: '4.3 Reliability & Availability',
            level: 2,
            content: data.nfr_reliability_availability
                .map((n) => `${n.id}: ${n.text}`)
                .join('\n\n')
        });
    }

    if (data.nfr_usability) {
        nfrChildren.push({
            id: 'nfr-usability',
            title: '4.4 Usability',
            level: 2,
            content: data.nfr_usability
                .map((n) => `${n.id}: ${n.text}`)
                .join('\n\n')
        });
    }

    if (data.nfr_maintainability) {
        nfrChildren.push({
            id: 'nfr-maintainability',
            title: '4.5 Maintainability',
            level: 2,
            content: data.nfr_maintainability
                .map((n) => `${n.id}: ${n.text}`)
                .join('\n\n')
        });
    }

    if (data.nfr_portability) {
        nfrChildren.push({
            id: 'nfr-portability',
            title: '4.6 Portability',
            level: 2,
            content: data.nfr_portability
                .map((n) => `${n.id}: ${n.text}`)
                .join('\n\n')
        });
    }

    if (data.nfr_compatibility) {
        nfrChildren.push({
            id: 'nfr-compatibility',
            title: '4.7 Compatibility',
            level: 2,
            content: data.nfr_compatibility
                .map((n) => `${n.id}: ${n.text}`)
                .join('\n\n')
        });
    }

    if (nfrChildren.length > 0) {
        sections.push({
            id: 'nfr',
            title: '4. Non-Functional Requirements',
            level: 1,
            content: 'Quality attributes and constraints',
            children: nfrChildren
        });
    }

    // 5. Data Requirements
    if (data.data_requirements) {
        sections.push({
            id: 'data-requirements',
            title: '5. Data Requirements',
            level: 1,
            content: 'Data storage and management requirements',
            children: data.data_requirements.map((dr) => ({
                id: dr.id.replace(':', '').toLowerCase(),
                title: dr.id,
                level: 2,
                content: dr.text
            }))
        });
    }

    // 6. External Interfaces
    if (data.external_interface_requirements) {
        sections.push({
            id: 'external-interfaces',
            title: '6. External Interface Requirements',
            level: 1,
            content: 'System integrations and APIs',
            children: data.external_interface_requirements.map((ir) => ({
                id: ir.id.replace(':', '').toLowerCase(),
                title: ir.id,
                level: 2,
                content: ir.text
            }))
        });
    }

    // 7. Domain Specifications
    if (data.domain_specific_specifications) {
        sections.push({
            id: 'domain-specs',
            title: '7. Domain Specific Specifications',
            level: 1,
            content: 'Blockchain and technical specifications',
            children: data.domain_specific_specifications.map((ds) => ({
                id: ds.id.replace(':', '').toLowerCase(),
                title: `${ds.id} (${ds.spec_type})`,
                level: 2,
                content: ds.text
            }))
        });
    }

    // 8. Design Constraints
    if (data.design_constraints) {
        sections.push({
            id: 'constraints',
            title: '8. Design Constraints',
            level: 1,
            content: 'System design constraints',
            children: data.design_constraints.map((c) => ({
                id: c.id.replace(':', '').toLowerCase(),
                title: c.id,
                level: 2,
                content: c.text
            }))
        });
    }

    // 9. Regulatory Constraints
    if (data.regulatory_constraints) {
        sections.push({
            id: 'regulatory',
            title: '9. Regulatory Constraints',
            level: 1,
            content: 'Compliance and legal requirements',
            children: data.regulatory_constraints.map((r) => ({
                id: r.id.replace(':', '').toLowerCase(),
                title: r.id,
                level: 2,
                content: r.text
            }))
        });
    }

    // 10. RBAC Matrix
    if (data.rbac_matrix) {
        sections.push({
            id: 'rbac',
            title: '10. RBAC Matrix',
            level: 1,
            content: 'Role-based access control permissions',
            children: data.rbac_matrix.map((r) => ({
                id: r.resource?.toLowerCase().replace(' ', '-') || 'resource',
                title: r.resource || 'Unknown',
                level: 2,
                content: `Description: ${r.description || ''}\n\nPermissions:\n${JSON.stringify(r.permissions, null, 2)}`
            }))
        });
    }

    // 11. Operational Requirements
    if (data.operational_requirements) {
        sections.push({
            id: 'operational',
            title: '11. Operational Requirements',
            level: 1,
            content: 'System operation and management',
            children: data.operational_requirements.map((op) => ({
                id: op.id.replace(':', '').toLowerCase(),
                title: `${op.id} (${op.category})`,
                level: 2,
                content: op.text
            }))
        });
    }

    // 12. Assumptions & Dependencies
    const assumptionsChildren: SRSSection[] = [];

    if (data.assumptions) {
        assumptionsChildren.push({
            id: 'assumptions',
            title: '12.1 Assumptions',
            level: 2,
            content: data.assumptions
                .map((a) => `${a.id}: ${a.text}`)
                .join('\n\n')
        });
    }

    if (data.external_dependencies) {
        assumptionsChildren.push({
            id: 'dependencies',
            title: '12.2 External Dependencies',
            level: 2,
            content: data.external_dependencies
                .map((d) => `${d.id}: ${d.text}`)
                .join('\n\n')
        });
    }

    if (data.prerequisites) {
        assumptionsChildren.push({
            id: 'prerequisites',
            title: '12.3 Prerequisites',
            level: 2,
            content: data.prerequisites
                .map((p) => `${p.id}: ${p.text}`)
                .join('\n\n')
        });
    }

    if (assumptionsChildren.length > 0) {
        sections.push({
            id: 'assumptions-dependencies',
            title: '12. Assumptions & Dependencies',
            level: 1,
            content: 'Project assumptions and external dependencies',
            children: assumptionsChildren
        });
    }

    // 13. Traceability
    if (data.traceability_map) {
        sections.push({
            id: 'traceability',
            title: '13. Traceability Map',
            level: 1,
            content: 'Requirements to goals mapping',
            children: data.traceability_map.map((tm) => ({
                id: tm.goal_id.toLowerCase(),
                title: tm.goal_id,
                level: 2,
                content: `Goal: ${tm.goal_description}\nCoverage: ${tm.coverage_status}\n\nRequirements: ${tm.requirement_ids?.join(', ')}\n\nUse Cases: ${tm.use_case_ids?.join(', ')}\n\nAcceptance Criteria: ${tm.acceptance_criteria_ids?.join(', ')}`
            }))
        });
    }

    // 14. Risks
    if (data.technical_risks) {
        sections.push({
            id: 'risks',
            title: '14. Technical Risks',
            level: 1,
            content: 'Identified risks and mitigations',
            children: data.technical_risks.map((r) => ({
                id: r.id.replace(':', '').toLowerCase(),
                title: r.id,
                level: 2,
                content: r.text
            }))
        });
    }

    // 15. Acceptance Criteria
    if (data.acceptance_criteria) {
        sections.push({
            id: 'acceptance',
            title: '15. Acceptance Criteria',
            level: 1,
            content: 'Success criteria for the system',
            children: data.acceptance_criteria.map((ac) => ({
                id: ac.id.replace(':', '').toLowerCase(),
                title: ac.id,
                level: 2,
                content: ac.text
            }))
        });
    }

    // 16. Data Privacy Inventory
    if (data.data_privacy_inventory) {
        sections.push({
            id: 'privacy',
            title: '16. Data Privacy Inventory',
            level: 1,
            content: 'PII data handling and protection',
            children: data.data_privacy_inventory.map((pii) => ({
                id: pii.id.replace(':', '').toLowerCase(),
                title: `${pii.id} (${pii.field_name})`,
                level: 2,
                content: `Classification: ${pii.data_classification}\nEncrypted at Rest: ${pii.encryption_at_rest}\nEncrypted in Transit: ${pii.encryption_in_transit}\nRetention: ${pii.retention_period}\nLegal Basis: ${pii.legal_basis}\nDeletion: ${pii.deletion_mechanism}`
            }))
        });
    }

    return sections;
}

// Export the converted data
export const SRS_DATA = convertSRSDataToSections();


