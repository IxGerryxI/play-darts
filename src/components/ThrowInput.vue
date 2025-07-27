<template>
    <div class="throw-input-wrapper">
        <!-- Input Display -->
        <div class="throw-input" :class="{ 'throw-input-active': showKeyboard }" @click="openKeyboard">
            <span class="text-medium-emphasis">{{ displayValue || '-' }}</span>
        </div>

        <!-- Keyboard Overlay -->
        <teleport to="body">
            <transition name="slide-up">
                <div v-if="showKeyboard" class="keyboard-overlay">
                    <div class="keyboard-header">
                        <div class="selected-value">
                            {{ displayValue || '-' }}
                        </div>
                        <v-btn variant="text" icon="mdi-close" @click="closeKeyboard"></v-btn>
                    </div>
                    <div class="input_wrapper">
                    <!-- Multiplier Selector -->
                    <div class="multiplier-selector">
                        <v-btn v-for="mult in multipliers" :key="mult.value" variant="text"
                            :color="multiplier === mult.value ? 'primary' : ''" @click="setMultiplier(mult.value)"
                            class="multiplier-btn">
                            {{ mult.label }}
                        </v-btn>
                    </div>

                    <!-- Number Pad -->
                    <div class="number-pad">
                        <div class="number-row">
                            <button v-for="num in numberRows" :key="num" class="number-btn"
                                :class="{ 'active': num === number }" @click="setNumber(num)">
                                {{ num === 25 ? 'Bull' : num }}
                            </button>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <v-btn variant="text" @click="missedThrow" class="flex-grow-1">
                            Daneben
                        </v-btn>
                        <v-btn color="primary" variant="flat" rounded="lg" @click="submit" class="flex-grow-1"
                            :disabled="!isValid" icon="mdi-arrow-right">
                        </v-btn>
                    </div> 
                    </div>
                </div>
            </transition>
        </teleport>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, toRefs } from 'vue';

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

const emit = defineEmits(['update:modelValue', 'enter', 'activate']);

const showKeyboard = ref(false);
const number = ref(null);
const multiplier = ref(''); // Empty for single, D for double, T for triple

const { modelValue, isActive } = toRefs(props);

watch(modelValue, (newVal) => {
    number.value = newVal;
    multiplier.value = '';
})

// Watch for active state changes
watch(isActive, (newVal) => {
    showKeyboard.value = newVal;
    if (newVal) {
        emit('activate');
    }
});

// Close keyboard when this input loses focus
watch(showKeyboard, (newVal) => {
    if (newVal) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

const numberRows = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 25];

const displayValue = computed(() => {
    if (!number.value) return '';
    const prefix = multiplier.value === 'S' ? '' : multiplier.value;
    return `${prefix}${number.value}`;
});

const isValid = computed(() => {
    return number.value !== null;
});

const multipliers = [
    { value: 'D', label: 'Double', multiplier: 2 },
    { value: 'T', label: 'Triple', multiplier: 3 }
]

function getMultiplierLabel(mult) {
    return {
        'D': 'Double',
        'T': 'Triple'
    }[mult];
}

function openKeyboard() {
    emit('activate');
    showKeyboard.value = true;
}

function closeKeyboard() {
    showKeyboard.value = false;
}

function setNumber(num) {
    number.value = num;
    updateValue();
}

function setMultiplier(mult) {
    if (multiplier.value === mult) multiplier.value = '';
    else multiplier.value = mult;
    updateValue();
}

function missedThrow() {
    number.value = 0;
    multiplier.value = 'S';
    updateValue();
    submit();
}

function clearInput() {
    number.value = null;
    multiplier.value = '';
    updateValue();
}

function submit() {
    if (isValid.value) {
        emit('enter');
        closeKeyboard();
    }
}

function updateValue() {
    emit('update:modelValue', displayValue.value);
}

// Close keyboard when clicking outside
function handleClickOutside(event) {
    const target = event.target;
    if (!target.closest('.keyboard-overlay') && !target.closest('.throw-input')) {
        closeKeyboard();
    }
}

// Add/remove click outside listener
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    document.body.style.overflow = '';
});
</script>

<style scoped>
.throw-input-wrapper {
    position: relative;
    width: 100%;
}

.input_wrapper {
    max-width: 700px;
    margin: 0 auto;
}

.throw-input {
    height: 60px;
    width: 100px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 1.25rem;
    background-color: rgba(255, 255, 255, 0.05);
}

.throw-input:hover {
    border-color: rgba(255, 255, 255, 0.4);
}

.throw-input-active {
    border-color: var(--v-theme-primary);
    box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.2);
}

.keyboard-overlay {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgb(var(--v-theme-surface));
    border-radius: 16px 16px 0 0;
    padding: 16px;
    box-shadow: 0 -4px 16px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    max-height: 80vh;
    overflow-y: auto;
}

.keyboard-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    padding: 0 25px 8px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.selected-value {
    font-size: 1.5rem;
    font-weight: 500;
}

.multiplier-selector {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
    overflow-x: auto;
    padding-bottom: 8px;
}

.multiplier-btn {
    flex: 1;
    min-width: 80px;
    border-radius: 8px;
    text-transform: none;
    font-weight: 500;
}

.number-pad {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 16px;
}

.number-row {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;

    & button {
        min-width: 12%;
    }
}

.number-btn {
    flex: 1;
    min-width: 0;
    height: 56px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 8px;
}

.number-btn:hover {
    background: rgba(255, 255, 255, 0.1);
}

.number-btn.active {
    background: var(--v-theme-primary);
    color: white;
    border-color: var(--v-theme-primary);
}

.action-buttons {
    display: flex;
    gap: 8px;
    margin-top: 8px;
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    transform: translateY(100%);
    opacity: 0;
}
</style>
