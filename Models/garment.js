
import mongoose from 'mongoose'

const garmentSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    image: String,
    isAvailable: Boolean
})

const Garment = mongoose.model('Garment', garmentSchema)


export default Garment