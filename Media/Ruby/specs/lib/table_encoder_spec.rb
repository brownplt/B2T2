# frozen_string_literal: true

require './lib/table_encoder'

# rubocop:disable RSpec/DescribeClass
# rubocop:disable Metrics/BlockLength
RSpec.describe 'table encoder logic' do
  describe '.TableEncoder.try_to_force_type' do
    describe 'when nil' do
      it 'successfully parses nil from empty string' do
        expect(TableEncoder.try_to_force_type('')).to be_nil
      end

      it 'successfully parses nil from empty string of spaces' do
        expect(TableEncoder.try_to_force_type('  ')).to be_nil
      end
    end

    describe 'when Boolean' do
      it 'successfully parses true Boolean' do
        expect(TableEncoder.try_to_force_type('true')).to be(true)
      end

      it 'successfully parses true Boolean with spacing' do
        expect(TableEncoder.try_to_force_type('   true   ')).to be(true)
      end

      it 'successfully parses false Boolean' do
        expect(TableEncoder.try_to_force_type('false')).to be(false)
      end

      it 'successfully parses false Boolean with spacing' do
        expect(TableEncoder.try_to_force_type('  false   ')).to be(false)
      end
    end

    describe 'when Integer' do
      it 'successfully parses Integer' do
        expect(TableEncoder.try_to_force_type('102')).to eq(102)
      end

      it 'successfully parses Integer with spacing' do
        expect(TableEncoder.try_to_force_type(' 132 ')).to eq(132)
      end
    end

    describe 'when Float' do
      it 'successfully parses Float' do
        expect(TableEncoder.try_to_force_type('102.0')).to eq(102.0)
      end

      it 'successfully parses Float with nothing following the decimal point' do
        expect(TableEncoder.try_to_force_type('102.')).to eq(102.0)
      end

      it 'successfully parses Float with spacing' do
        expect(TableEncoder.try_to_force_type('   132.123 ')).to eq(132.123)
      end
    end

    describe 'when String' do
      describe 'when double quotes are used' do
        it 'successfully parses String' do
          expect(TableEncoder.try_to_force_type('"hello"')).to eq('"hello"')
        end

        it 'successfully parses String with spacing' do
          expect(TableEncoder.try_to_force_type(' "hello" ')).to eq('"hello"')
        end

        it 'successfully parses String when integer with punctuation' do
          expect(TableEncoder.try_to_force_type('"102!"')).to eq('"102!"')
        end
      end

      describe 'when single quotes are used' do
        it 'successfully parses String' do
          expect(TableEncoder.try_to_force_type('\'hello\'')).to eq("'hello'")
        end

        it 'successfully parses String with spacing' do
          expect(TableEncoder.try_to_force_type(' \'hello\' ')).to eq("'hello'")
        end

        it 'successfully parses String when integer with punctuation' do
          expect(TableEncoder.try_to_force_type('\'102!\'')).to eq("'102!'")
        end
      end

      describe 'when no quotes are used' do
        it 'successfully parses String' do
          expect(TableEncoder.try_to_force_type('hello')).to eq('hello')
        end

        it 'successfully parses String with spacing' do
          expect(TableEncoder.try_to_force_type(' hello ')).to eq('hello')
        end

        it 'successfully parses String when integer with punctuation' do
          expect(TableEncoder.try_to_force_type('102!')).to eq('102!')
        end
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
# rubocop:enable RSpec/NestedGroups
# rubocop:enable Metrics/BlockLength
