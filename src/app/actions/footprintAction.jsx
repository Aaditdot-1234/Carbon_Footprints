import { Query } from "appwrite";
import { db, ID} from "../appwrite";

export async function footprintAction(userId, sections, results) {
    try {
        const section = sections[0];

        await db.createDocument(
            'footprints',
            'footprintsData',
            ID.unique(),
            {
                mode: section.mode,
                fuelType: section.fuelType || null,
                mileage: section.mileage ? parseFloat(section.mileage) : null,
                distance: parseFloat(section.distance),
                emissionFactor: parseFloat(results.sections[0].emissionFactor), 
                carbonFootprint: parseFloat(results.sections[0].carbonFootprint),
                UserID: userId
            }
        );

       
        const totalEmissionFactor = await calculateTotalEmissionFactor(userId);
        const totalCarbonFootprint = await calculateTotalCarbonFootprint(userId);
        const totalDistanceTravelled = await calculateTotalDistanceTravelled(userId);
        
        const summaryDocument = await db.listDocuments('footprints', 'footprintSummaries', [
            Query.equal('UserID', userId)
        ]);

        if (summaryDocument.documents.length > 0) {
            
            const summaryId = summaryDocument.documents[0].$id; 
            await db.updateDocument(
                'footprints',
                'footprintSummaries',
                summaryId,
                {
                    totalEmissionFactor: totalEmissionFactor,
                    totalCarbonFootprint: totalCarbonFootprint,
                    totalDistanceTravelled: totalDistanceTravelled
                }
            );
        } else {
            await db.createDocument(
                'footprints',
                'footprintSummaries',
                ID.unique(),
                {
                    UserID: userId,
                    totalEmissionFactor: totalEmissionFactor,
                    totalCarbonFootprint: totalCarbonFootprint,
                    totalDistanceTravelled: totalDistanceTravelled
                }
            );
        }

        const creditpoints = Math.round(calculateCreditPoints(totalCarbonFootprint, results.sections[0].carbonFootprint));
        console.log(totalDistanceTravelled)

        await db.createDocument(
            'footprints',
            'creditPoints',
            ID.unique(),
            {
                UserID: userId,
                credit: creditpoints,
                calculatedAt: new Date().toISOString() 
            }
        );

        return {
            totalEmissionFactor,
            totalCarbonFootprint,
            totalDistanceTravelled,
            creditpoints
        };

    } catch (error) {
        console.error("Error storing footprint data:", error);
        throw new Error("Could not store footprint data.");
    }
}
 
function calculateCreditPoints(historicalFootprint, currentFootprint) {
    const scalingFactor = 10; 
    if (historicalFootprint === currentFootprint) {
        return 0;
    }
    return ((historicalFootprint - currentFootprint) / historicalFootprint) * scalingFactor;
}

async function calculateTotalEmissionFactor(userId) {
    try {
        const result = await db.listDocuments('footprints', 'footprintsData', [
            Query.equal('UserID', userId) 
        ]);

        return result.documents.reduce((sum, doc) => sum + (doc.emissionFactor || 0), 0);
    } catch (error) {
        console.error("Error fetching emission factors:", error);
        throw new Error("Could not calculate total emission factor.");
    }
}

async function calculateTotalCarbonFootprint(userId) {
    try {
        const result = await db.listDocuments('footprints', 'footprintsData', [
            Query.equal('UserID', userId) 
        ]);

        return result.documents.reduce((sum, doc) => sum + (doc.carbonFootprint || 0), 0);
    } catch (error) {
        console.error("Error fetching carbon footprints:", error);
        throw new Error("Could not calculate total carbon footprint.");
    }
}

async function calculateTotalDistanceTravelled(userId) {
    try {
        const result = await db.listDocuments('footprints', 'footprintsData', [
            Query.equal('UserID', userId) 
        ]);

        return result.documents.reduce((sum, doc) => sum + (doc.distance || 0), 0);
    } catch (error) {
        console.error("Error fetching carbon footprints:", error);
        throw new Error("Could not calculate total carbon footprint.");
    }
}