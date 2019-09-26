// File with swagger model definitions

/**
 * @swagger
 * definitions:
 *   Pet:
 *     type: "object"
 *     properties: 
 *       _id:
 *         type: string
 *       name:
 *         type: string
 *       owner:
 *         type: string
 *         $ref: '#/definitions/Owner'
 *       pet_type:
 *         type: string
 *       age:
 *         type: integer
 *         format: int64
 *         minimum: 1
 *       visits:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               vet_id:
 *                 type: string
 *                 $ref: '#/definitions/Vet'
 *               reason: 
 *                 type: string
 *               visit_date:
 *                 type: date
 *     required: 
 *       - name
 *       - owner
 *       - pet_type
 *       - age
 *   Owner: 
 *     type: "object"
 *     properties: 
 *       _id:
 *         type: string
 *       last_name:
 *         type: string
 *       first_name:
 *         type: string
 *       address:
 *         type: string
 *       city:
 *         type: string
 *       state:
 *         type: string
 *       telephone:
 *         type: string
 *       pets:
 *         type: array
 *         items:
 *           type: object
 *           properties:
 *             pet_id:
 *               type: string
 *               $ref: '#/definitions/Pet'
 *     required: 
 *       - last_name
 *       - first_name
 *       - address
 *       - city
 *       - state
 *       - telephone
 *   Vet:
 *     type: "object"
 *     properties:
 *       _id:
 *         type: string
 *       last_name:
 *         type: string
 *       first_name:
 *         type: string
 *       address:
 *         type: string
 *       city:
 *         type: string
 *       state:
 *         type: string
 *       telephone:
 *         type: string      
 *     required:
 *       - last_name
 *       - first_name
 *       - address
 *       - city
 *       - state
 *       - telephone
 */