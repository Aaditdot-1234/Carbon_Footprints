'use client'
import { Query } from "appwrite";
import { db, ID} from "../appwrite";

/**
 * @typedef {Object} FootprintData
 * @property {string} UserID 
 * @property {string} mode 
 * @property {string} fuelType 
 * @property {number} mileage 
 * @property {number} distance 
 * @property {number} emissionFactor 
 * @property {number} carbonFootprint 
 * @property {Date} createdAt 
 */

/**
 * @param {string} userId 
 * @returns {Promise<FootprintData[]>} 
 */

export async function fetchDataTable1(userId) {
    try {
        const result1 = await db.listDocuments('footprints', 'footprintsData', [
            Query.equal('UserID', userId) 
        ]);
        
        const response1 = result1.documents.map(doc => ({
            UserID: doc.UserID,
            mode: doc.mode,
            fuelType: doc.fuelType,
            mileage: doc.mileage,
            distance: doc.distance,
            emissionFactor: doc.emissionFactor,
            carbonFootprint: doc.carbonFootprint,
            createdAt : doc.$createdAt
        }));

        return response1;
        
    } catch (error) {
        console.error("Error fetching emission factors:", error);
        throw new Error("Could not calculate total emission factor.");
    }
}

/**
 * @typedef {Object} FootprintSummary
 * @property {string} UserID 
 * @property {number} totalEmissionFactor 
 * @property {number} totalCarbonFootprint 
 * @property {number} totalDistanceTravelled 
 */

/**
 * @param {string} userId 
 * @returns {Promise<FootprintSummary[]>} 
 */


export async function fetchDataTable2(userId) {
    try {
        const result2 = await db.listDocuments('footprints', 'footprintSummaries', [
            Query.equal('UserID', userId) 
        ]);
        
        return result2.documents.map(doc => ({
            UserID: doc.UserID,
            totalEmissionFactor: doc.totalEmissionFactor,
            totalCarbonFootprint: doc.totalCarbonFootprint,
            totalDistanceTravelled: doc.totalDistanceTravelled
        }));

    } catch (error) {
        console.error("Error fetching emission factors:", error);
        throw new Error("Could not calculate total emission factor.");
    }
}

/**
 * @typedef {Object} CreditPointsData
 * @property {string} UserID 
 * @property {number} creditPoints 
 * @property {Date} calculatedAt 
 */

/**
 * Fetches Credit Points data for a user.
 * @param {string} userId 
 * @returns {Promise<CreditPointsData[]>} 
 */
export async function fetchCreditPoints(userId) {
    try {
        const result3 = await db.listDocuments('footprints', 'creditPoints', [
            Query.equal('UserID', userId)
        ]);

        return result3.documents.map(doc => ({
            UserID: doc.UserID,
            creditPoints: doc.creditPoints,
            calculatedAt: doc.calculatedAt || doc.$createdAt
        }));
    } catch (error) {
        console.error("Error fetching Credit Points data:", error);
        throw new Error("Could not fetch Credit Points data.");
    }
}